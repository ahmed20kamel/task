from rest_framework import serializers
from .models import Task, TaskEvaluation
from accounts.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    duration_days = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'completed_at')


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'assigned_to', 'priority', 'due_date')
    
    def validate_assigned_to(self, value):
        if value and not value.is_employee:
            raise serializers.ValidationError('يمكن تعيين المهمة للموظفين فقط')
        return value


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'assigned_to', 'status', 'priority', 'due_date')
    
    def validate_status(self, value):
        if value == 'completed':
            # يمكن إضافة منطق إضافي هنا
            pass
        return value


class TaskEvaluationSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    evaluated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskEvaluation
        fields = '__all__'
        read_only_fields = ('evaluated_at',)


class TaskEvaluationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskEvaluation
        fields = ('task', 'rating', 'feedback')
    
    def validate_task(self, value):
        if value.status != 'completed':
            raise serializers.ValidationError('يمكن تقييم المهام المكتملة فقط')
        if hasattr(value, 'evaluation'):
            raise serializers.ValidationError('تم تقييم هذه المهمة مسبقاً')
        return value

