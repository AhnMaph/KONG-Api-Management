from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
router = DefaultRouter()
router.register(r'novel', NovelViewSet)  # /api/manga/
novel_custom_urls = [
    path('<str:pk>/updateNumFavorite/', updateNumFavorite, name='updateNumFavorite'),
    path('<str:pk>/updateNumComments/', updateNumComments, name='updateNumComments'),
]

urlpatterns = [
    path('novel/advanced-search/', advanced_search, name='advanced_search'),
    path('novel/', include((novel_custom_urls, 'novel'))),
    path('', include(router.urls)),
]

