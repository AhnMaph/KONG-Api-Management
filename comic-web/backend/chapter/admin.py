from django.contrib import admin
from .models import *
from .forms import MangaChapterForm
from django.utils.html import format_html
class MangaChapterImageInline(admin.TabularInline):  
    model = MangaChapterImage
    extra = 0  # Cho phép thêm ảnh dễ dàng
    fields = ["image","page"]
    ordering = ["page"]  # Sắp xếp theo thứ tự trang
    
# class MangaChapterAdmin(admin.ModelAdmin):
#     list_display = ("title", "manga", "chapter_number", "views", "created_at")
#     list_filter = ("manga",)
#     search_fields = ("title", "manga__title")
#     inlines = [MangaChapterImageInline]  # Hiển thị ảnh trong Chapter

class MangaChapterAdmin(admin.ModelAdmin):
    form = MangaChapterForm  # Sử dụng form tùy chỉnh cho MangaChapter
    
    fields = ['chapter_number', 'manga', 'title', 'images']
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        images = form.cleaned_data.get("images", [])
        for idx, image in enumerate(images):
            MangaChapterImage.objects.create(chapter=obj, image=image, page=idx)
    list_display = ("_id","title", "manga","chapter_number", "created_at")
    inlines = [MangaChapterImageInline]  # Hiển thị ảnh trong MangaChapter
    search_fields = ("manga___id", "manga__title","chapter_number","title")
    class Media:
        js = (
            'admin/custom_admin.js',  # Đường dẫn đến file JavaScript tùy chỉnh
        )
class NovelChapterAdmin(admin.ModelAdmin):
    list_display = ("_id", "title", "novel", "chapter_number", "created_at")
    search_fields = ("novel__title", "novel___id","chapter_number","title")
    list_filter = ("novel",)
    ordering = ("-created_at",)   
admin.site.register(MangaChapter, MangaChapterAdmin)
admin.site.register(NovelChapter,NovelChapterAdmin)