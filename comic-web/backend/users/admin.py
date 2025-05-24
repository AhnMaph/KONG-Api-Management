from django.contrib import admin
from .models import JWTKey
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib import admin

import requests
from dotenv import load_dotenv
import os
load_dotenv()
KONG_ADMIN_URL = os.getenv("KONG_ADMIN_URL")

@admin.register(JWTKey)
class JWTKeyAdmin(admin.ModelAdmin):
    list_display = ("id", "key", "secret","user_id", "created_at")

    
def sync_kong_acl(username, new_groups):
    # Lấy ACL hiện tại từ Kong
    r = requests.get(f"{KONG_ADMIN_URL}/consumers/{username}/acls")
    if r.status_code == 200:
        existing = set(g['group'] for g in r.json().get('data', []))
    else:
        existing = set()
    target = set(new_groups)
    to_add = target - existing
    to_remove = existing - target
    # print("Group: ",group)
    for group in to_add:
        requests.post(f"{KONG_ADMIN_URL}/consumers/{username}/acls", data={"group": group})

    for group in to_remove:
        requests.delete(f"{KONG_ADMIN_URL}/consumers/{username}/acls/{group}")
class CustomUserAdmin(UserAdmin):
    def save_model(self, request, obj, form, change):
        # Gọi trước để lưu User
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        user = form.instance
        username = user.id

        group_names = list(user.groups.values_list('name', flat=True))
        print("[Kong sync] Updated groups:", group_names)

        sync_kong_acl(username, group_names)
    def delete_model(self, request, obj):
        username = obj.id
        try:
            response = requests.delete(f"{KONG_ADMIN_URL}/consumers/{username}")
            if response.status_code == 204:
                print(f"Deleted Kong consumer for user: {username}")
            elif response.status_code == 404:
                print(f"No Kong consumer found for: {username}")
            else:
                print(f"Failed to delete Kong consumer: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error deleting Kong consumer: {e}")
        super().delete_model(request, obj)
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
