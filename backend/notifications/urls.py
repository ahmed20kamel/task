from django.urls import path
from . import views

urlpatterns = [
    path('', views.notification_list, name='notification_list'),
    path('<int:pk>/read/', views.notification_read, name='notification_read'),
    path('<int:pk>/delete/', views.notification_delete, name='notification_delete'),
    path('unread-count/', views.unread_count, name='unread_count'),
]

