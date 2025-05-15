from .models import MangaChapter, MangaChapterImage, NovelChapter
from rest_framework import serializers
class MangaChapterImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MangaChapterImage
        fields = '__all__'
class MangaChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MangaChapter
        fields = '__all__'
class MangaChapterDetailSerializer(serializers.ModelSerializer):
    chapterImages = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = MangaChapter
        fields = '__all__'
    def get_chapterImages(self, obj):
        images = MangaChapterImage.objects.filter(chapter=obj)
        serializer = MangaChapterImageSerializer(images, many=True)
        return serializer.data
class NovelChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NovelChapter
        fields = '__all__'

class NovelChapterDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NovelChapter
        fields = '__all__'
