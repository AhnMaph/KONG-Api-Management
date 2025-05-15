from django.shortcuts import render

# Create your views here.
# app/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.decorators import action

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(parent=None).order_by('-created_at') # chỉ lấy bình luận gốc
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        parent_id = request.data.get('parent')
        if parent_id:
            try:
                parent = Comment.objects.get(id=parent_id)
            except Comment.DoesNotExist:
                return Response({'error': 'Parent comment not found.'}, status=404)
            comment = Comment.objects.create(
                username=request.data['username'],
                avatar=request.data['avatar'],
                level=request.data.get('level', 1),
                content=request.data['content'],
                parent=parent
            )
        else:
            comment = Comment.objects.create(
                username=request.data['username'],
                avatar=request.data['avatar'],
                level=request.data.get('level', 1),
                content=request.data['content'],
            )
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        comment.likes += 1
        comment.save()
        return Response({'likes': comment.likes})
