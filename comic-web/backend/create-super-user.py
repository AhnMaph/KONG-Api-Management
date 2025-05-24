import os
import sys
import django
from dotenv import load_dotenv
# 1. load env var
load_dotenv()

# 2. setup env in django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()
def create_superuser():
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Lấy thông tin từ biến môi trường
    username = os.getenv('SUPERUSER_USERNAME')
    email = os.getenv('SUPERUSER_EMAIL')
    password = os.getenv('SUPERUSER_PASSWORD')
    print("Running create super user...")
    if not all([username, email, password]):
        raise ValueError(f"Thiếu biến môi trường: username={username}, email={email}, password={'***' if password else None}")
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
create_superuser()