from django.urls import path
from . import views
from .views import post_collection, post_element, home

urlpatterns = [
    path('', views.home, name="home" ),
    path('create-post/', views.create_post, name='create_post'),
    path('delete-post/', views.delete_post, name='delete_post'),
    path("", home, name='home'),
    path('api/v1/posts/', post_collection),
    path('api/v1/posts/<int:pk>/', post_element)
]
