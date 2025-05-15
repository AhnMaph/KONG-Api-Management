from django.contrib import admin
from .models import Novel
@admin.register(Novel)
class NovelAdmin(admin.ModelAdmin):
    list_display = ("title", "numViews", "numChapters","status", "created_at")
    readonly_fields = ("numViews","numChapters","numFavorites","numComments","numLikes")