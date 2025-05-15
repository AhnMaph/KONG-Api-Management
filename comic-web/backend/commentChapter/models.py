from django.db import models

# Create your models here.
# app/models.py


class Comment(models.Model):
    username = models.CharField(max_length=100)
    avatar = models.URLField()
    level = models.IntegerField(default=1)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.username} - {self.content[:30]}"
