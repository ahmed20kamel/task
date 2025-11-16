from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد الانتظار'),
        ('in_progress', 'قيد التنفيذ'),
        ('completed', 'مكتمل'),
        ('cancelled', 'ملغي'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'منخفض'),
        ('medium', 'متوسط'),
        ('high', 'عالي'),
        ('urgent', 'عاجل'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='عنوان المهمة')
    description = models.TextField(verbose_name='الوصف')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks', verbose_name='أنشأ بواسطة')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks', verbose_name='مكلف إلى')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='الحالة')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name='الأولوية')
    due_date = models.DateTimeField(verbose_name='تاريخ الانتهاء')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الإتمام')
    
    class Meta:
        verbose_name = 'مهمة'
        verbose_name_plural = 'المهام'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def is_overdue(self):
        return timezone.now() > self.due_date and self.status not in ['completed', 'cancelled']
    
    @property
    def duration_days(self):
        if self.due_date:
            delta = self.due_date - self.created_at
            return delta.days
        return None


class TaskEvaluation(models.Model):
    RATING_CHOICES = [
        (1, 'ضعيف جداً'),
        (2, 'ضعيف'),
        (3, 'متوسط'),
        (4, 'جيد'),
        (5, 'ممتاز'),
    ]
    
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='evaluation', verbose_name='المهمة')
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name='التقييم')
    feedback = models.TextField(blank=True, null=True, verbose_name='ملاحظات')
    evaluated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations', verbose_name='قيم بواسطة')
    evaluated_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التقييم')
    
    class Meta:
        verbose_name = 'تقييم المهمة'
        verbose_name_plural = 'تقييمات المهام'
    
    def __str__(self):
        return f'تقييم {self.task.title} - {self.rating}'

