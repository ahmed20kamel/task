from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'مدير'),
        ('employee', 'موظف'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='employee', verbose_name='الدور')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='الهاتف')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='الصورة الشخصية')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    
    class Meta:
        verbose_name = 'مستخدم'
        verbose_name_plural = 'المستخدمون'
    
    def __str__(self):
        return self.username
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_employee(self):
        return self.role == 'employee'

