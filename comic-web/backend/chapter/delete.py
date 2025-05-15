import os
import sys
import django

# Khởi tạo Django
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from manga.models import Manga
from chapter.models import MangaChapter, MangaChapterImage

def delete_all_manga_data():
    print("🧨 Đang xoá tất cả ảnh chương...")
    MangaChapterImage.objects.all().delete()

    print("🧨 Đang xoá tất cả chương...")
    MangaChapter.objects.all().delete()

    print("🧨 Đang xoá tất cả manga...")
    Manga.objects.all().delete()

    print("✅ Đã xoá toàn bộ dữ liệu!")

if __name__ == '__main__':
    delete_all_manga_data()
