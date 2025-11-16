from django.contrib import admin
from .models import Task, TaskEvaluation


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'assigned_to', 'status', 'priority', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'created_at', 'due_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at', 'completed_at')


@admin.register(TaskEvaluation)
class TaskEvaluationAdmin(admin.ModelAdmin):
    list_display = ('task', 'rating', 'evaluated_by', 'evaluated_at')
    list_filter = ('rating', 'evaluated_at')

