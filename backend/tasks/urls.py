from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list_create, name='task_list_create'),
    path('<int:pk>/', views.task_detail, name='task_detail'),
    path('evaluations/', views.evaluation_list_create, name='evaluation_list_create'),
    path('statistics/', views.task_statistics, name='task_statistics'),
]

