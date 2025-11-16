from rest_framework import serializers
from .models import Notification
from tasks.serializers import TaskSerializer


class NotificationSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('created_at',)

