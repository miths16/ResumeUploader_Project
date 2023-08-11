from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('resume/', views.ProfileView.as_view(), name='resume'),
    path('list/', views.ProfileView.as_view(), name='list')

]