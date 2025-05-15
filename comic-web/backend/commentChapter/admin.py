from django.contrib import admin
from .models import Comment

class CommentAdmin(admin.ModelAdmin):
    list_display = ('username', 'content', 'created_at', 'likes', 'level', 'get_parent')
    list_filter = ('created_at', 'level')

    # Sử dụng phương thức get_parent để hiển thị thông tin của parent trong list_display
    def get_parent(self, obj):
        return obj.parent.username if obj.parent else "None"
    get_parent.short_description = 'Parent Comment'  # Thêm tiêu đề cho cột "Parent Comment"

    # Đảm bảo rằng bạn có thể tìm kiếm trên 'content' và 'username'
    search_fields = ('content', 'username')

admin.site.register(Comment, CommentAdmin)
