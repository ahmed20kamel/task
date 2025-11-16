from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Task, TaskEvaluation
from .serializers import (
    TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer,
    TaskEvaluationSerializer, TaskEvaluationCreateSerializer
)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list_create(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        
        # Filtering based on user role
        if request.user.is_employee:
            tasks = tasks.filter(assigned_to=request.user)
        elif request.user.is_admin:
            # Admin can see all tasks or filter by created_by
            created_by = request.query_params.get('created_by')
            if created_by:
                tasks = tasks.filter(created_by_id=created_by)
        
        # Additional filters
        status_filter = request.query_params.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        
        priority_filter = request.query_params.get('priority')
        if priority_filter:
            tasks = tasks.filter(priority=priority_filter)
        
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_admin:
            return Response(
                {'error': 'فقط المدير يمكنه إنشاء المهام'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TaskCreateSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save(created_by=request.user)
            
            # Create notification for assigned employee
            if task.assigned_to:
                from notifications.models import Notification
                Notification.objects.create(
                    user=task.assigned_to,
                    title='مهمة جديدة',
                    message=f'تم تعيين مهمة جديدة لك: {task.title}',
                    task=task
                )
            
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'المهمة غير موجودة'}, status=status.HTTP_404_NOT_FOUND)
    
    # Permission check
    if request.user.is_employee and task.assigned_to != request.user:
        return Response(
            {'error': 'ليس لديك صلاحية للوصول لهذه المهمة'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if request.user.is_employee:
            # Employees can only update status
            if 'status' not in request.data:
                return Response(
                    {'error': 'يمكنك تحديث حالة المهمة فقط'},
                    status=status.HTTP_403_FORBIDDEN
                )
            if request.data.get('status') == 'completed':
                from django.utils import timezone
                task.completed_at = timezone.now()
                task.save()
            
            serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
        else:
            serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Notify admin when employee updates status
            if request.user.is_employee and 'status' in request.data:
                from notifications.models import Notification
                Notification.objects.create(
                    user=task.created_by,
                    title='تحديث المهمة',
                    message=f'تم تحديث حالة المهمة "{task.title}" من قبل {request.user.username}',
                    task=task
                )
            
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if not request.user.is_admin or task.created_by != request.user:
            return Response(
                {'error': 'فقط منشئ المهمة يمكنه حذفها'},
                status=status.HTTP_403_FORBIDDEN
            )
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def evaluation_list_create(request):
    if request.method == 'GET':
        evaluations = TaskEvaluation.objects.all()
        
        if request.user.is_employee:
            evaluations = evaluations.filter(task__assigned_to=request.user)
        elif request.user.is_admin:
            evaluations = evaluations.filter(evaluated_by=request.user)
        
        serializer = TaskEvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_admin:
            return Response(
                {'error': 'فقط المدير يمكنه تقييم المهام'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TaskEvaluationCreateSerializer(data=request.data)
        if serializer.is_valid():
            evaluation = serializer.save(evaluated_by=request.user)
            
            # Notify employee about evaluation
            from notifications.models import Notification
            Notification.objects.create(
                user=evaluation.task.assigned_to,
                title='تقييم المهمة',
                message=f'تم تقييم مهمتك "{evaluation.task.title}" بتقييم {evaluation.rating}',
                task=evaluation.task
            )
            
            return Response(TaskEvaluationSerializer(evaluation).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_statistics(request):
    if request.user.is_admin:
        total_tasks = Task.objects.count()
        pending_tasks = Task.objects.filter(status='pending').count()
        in_progress_tasks = Task.objects.filter(status='in_progress').count()
        completed_tasks = Task.objects.filter(status='completed').count()
        overdue_tasks = Task.objects.filter(status__in=['pending', 'in_progress']).extra(
            where=["due_date < datetime('now')"]
        ).count()
    else:
        total_tasks = Task.objects.filter(assigned_to=request.user).count()
        pending_tasks = Task.objects.filter(assigned_to=request.user, status='pending').count()
        in_progress_tasks = Task.objects.filter(assigned_to=request.user, status='in_progress').count()
        completed_tasks = Task.objects.filter(assigned_to=request.user, status='completed').count()
        overdue_tasks = Task.objects.filter(
            assigned_to=request.user,
            status__in=['pending', 'in_progress']
        ).extra(
            where=["due_date < datetime('now')"]
        ).count()
    
    return Response({
        'total_tasks': total_tasks,
        'pending_tasks': pending_tasks,
        'in_progress_tasks': in_progress_tasks,
        'completed_tasks': completed_tasks,
        'overdue_tasks': overdue_tasks,
    })

