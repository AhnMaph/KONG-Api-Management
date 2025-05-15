import os
import sys
import django
from django.core.files import File

# Khởi tạo Django
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from manga.models import Manga
from chapter.models import MangaChapter, MangaChapterImage

# Đường dẫn ảnh mẫu
print(project_path)
SAMPLE_IMAGE_PATH = os.path.join(project_path, 'chapter', 'sample.png')
print(SAMPLE_IMAGE_PATH)

def create_fake_chapters():
    mangas = Manga.objects.all()

    if not os.path.exists(SAMPLE_IMAGE_PATH):
        print("❌ Không tìm thấy ảnh mẫu!")
        return

    for manga in mangas:
        print(f"📖 Đang xử lý: {manga.title}")

        for ch_num in range(1, 16):  # Tạo 15 chương
            chapter = MangaChapter.objects.create(
                manga=manga,
                title=f"Chương {ch_num}",
                chapter_number=ch_num
            )
            print(f"  ➕ Tạo {chapter.title}")

            for page_num in range(1, 11):  # Mỗi chương có 10 ảnh
                with open(SAMPLE_IMAGE_PATH, 'rb') as img_file:
                    MangaChapterImage.objects.create(
                        chapter=chapter,
                        image=File(img_file, name=f"{chapter._id}_{page_num}.jpg"),
                        page=page_num
                    )
            print(f"     ✅ Thêm 10 ảnh cho {chapter.title}")

    print("🎉 Đã hoàn tất tạo chương và ảnh giả!")

if __name__ == '__main__':
    create_fake_chapters()
