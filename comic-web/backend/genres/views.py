from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from rest_framework import viewsets,status
from .views import *
from .models import Genre
from .serializers import GenresSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAdminUser

class GenresViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenresSerializer
    permission_classes = [AllowAny]
    
    
@api_view(["GET"])
@permission_classes([AllowAny])
def genre_request(request):
    genres = Genre.objects.all() 
    serializer = GenresSerializer(genres, many=True)
    return Response({"genres": serializer.data}, status=status.HTTP_200_OK)