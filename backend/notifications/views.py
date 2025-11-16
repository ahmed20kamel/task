from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(user=request.user)
    unread_count = notifications.filter(is_read=False).count()
    
    # Mark all as read if requested
    mark_all_read = request.query_params.get('mark_all_read')
    if mark_all_read == 'true':
        notifications.update(is_read=True)
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response({
        'notifications': serializer.data,
        'unread_count': unread_count
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def notification_read(request, pk):
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'الإشعار غير موجود'}, status=status.HTTP_404_NOT_FOUND)
    
    notification.is_read = True
    notification.save()
    
    return Response(NotificationSerializer(notification).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def notification_delete(request, pk):
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'الإشعار غير موجود'}, status=status.HTTP_404_NOT_FOUND)
    
    notification.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({'unread_count': count})

