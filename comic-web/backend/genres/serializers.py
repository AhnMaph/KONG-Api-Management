from rest_framework import serializers

from .models import Genre, Author

class GenresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('_id', 'name')
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'