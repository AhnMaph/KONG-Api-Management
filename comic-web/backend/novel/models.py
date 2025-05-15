from django.db import models
import uuid
from genres.models import Genre
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.utils.html import mark_safe
import os
class Novel(models.Model):
    _id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    STATUS_CHOICES = [
        ('completed', 'Hoàn thành'),
        ('ongoing', 'Còn tiếp'),
        ('paused', 'Tạm ngưng'),
        ('unverified', 'Chưa xác minh'),
    ]
    
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='novel_covers/', default='novel_covers/default.jpg', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    genres = models.ManyToManyField(
        Genre, related_name='genres', blank=True)
    source = models.CharField(max_length=255,default='Không rõ')
    numComments = models.IntegerField(null=True,blank=True,default=0)
    numViews = models.IntegerField(null=True,blank=True,default=0)
    numFavorites = models.IntegerField(null=True,blank=True,default=0)
    numChapters = models.IntegerField(null=True,blank=True,default=0)
    numLikes = models.IntegerField(null=True,blank=True,default=0)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='unverified'
    )
    def __str__(self):
        return self.title