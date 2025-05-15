import json
import os
import django
import sys


# Dynamically setting the Django project path
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # Lấy đường dẫn gốc của dự án
sys.path.append(project_path)

# Set the default settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Initialize Django
django.setup()

from django.core.files import File
from manga.models import Manga
from genres.models import Genre

def import_mangas(json_file_path):
    Manga.objects.all().delete()  # Xóa dữ liệu cũ

    with open(json_file_path, encoding='utf-8') as f:
        data = json.load(f)

        for item in data:
            # Đường dẫn ảnh thật nằm trong backend/manga/Doraemon1.jpg
            image_path = os.path.join(project_path, 'manga', 'Doraemon1.jpg')
            if not os.path.exists(image_path):
                print(f"❌ Không tìm thấy ảnh {image_path}")
                continue

            with open(image_path, 'rb') as img_file:
                manga = Manga.objects.create(
                    title=item['title'],
                    author=item['author'],
                    description=item['description'],
                    cover_image=File(img_file, name='Doraemon1.jpg')
                )

            for genre_name in item.get('genres', []):
                genre, _ = Genre.objects.get_or_create(name=genre_name)
                manga.genres.add(genre)

    print("✅ Manga imported successfully!")

if __name__ == '__main__':
    json_file_path = os.path.join(project_path, 'manga', 'UNREAL_data.JSON')
    print(json_file_path)
    import_mangas(json_file_path)
