from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('audio/tts/<str:filename>/', text_to_speech),
]

