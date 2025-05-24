import secrets
import jwt
import requests
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import *
from .models import *
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from datetime import datetime, timedelta,timezone
from rest_framework.views import APIView
from dotenv import load_dotenv
import os
load_dotenv()
KONG_ADMIN_URL = os.getenv("KONG_ADMIN_URL")
def create_jwt(user, key, secret):
    # 5. Tạo JWT Access Token
    now = datetime.now(timezone.utc)
    access_token = jwt.encode({
        "iss": key,
        "sub": str(user.id),
        "username": str(user.id),
        "iat": now,
        "exp": now + timedelta(minutes=5),
    }, secret, algorithm="HS256")

    # 6. Tạo Refresh Token (giản lược — có thể dùng SimpleJWT chính quy)
    refresh_token = jwt.encode({
        "sub": str(user.id),
        "type": "refresh",
        "iat": now,
        "exp": now + timedelta(days=7)
    }, secret, algorithm="HS256")

    return access_token, refresh_token

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        if not all([username, email, password]):
           return  Response({"error": "Username, email, and password are required"}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        # 1. Tạo user trong Django
        user = User.objects.create_user(username=username, email=email, password=password)

        # 2. Tạo Kong Consumer
        kong_consumer_resp = requests.post(
            f"{KONG_ADMIN_URL}/consumers",
            json={"username": str(user.id)}
        )
        if kong_consumer_resp.status_code not in (200, 201):
            return Response({"error": "Kong consumer creation failed"}, status=500)

        # 3. Tạo JWT Credential
        key = f"user_{user.id}_key"
        secret = secrets.token_urlsafe(32)

        kong_jwt_resp = requests.post(
            f"{KONG_ADMIN_URL}/consumers/{str(user.id)}/jwt",
            json={"key": key, "secret": secret}
        )
        if kong_jwt_resp.status_code not in (200, 201):
            return Response({"error": "Kong JWT credential creation failed"}, status=500)

        # 4. Tạo refresh/access token
        access_token, refresh_token = create_jwt(user, key, secret)

        # 5. Lưu key/secret 
        JWTKey.objects.create(user=user, key=key, secret=secret)


        # 6. Trả token qua cookie
        response = Response({"message": "User registered", "id": user.id},status=200)
        
        # Set cookie (HttpOnly, Secure nếu prod)
        response.set_cookie("access_token", 
                            access_token, 
                            httponly=True,
                            domain='kong', 
                            max_age=300)
        response.set_cookie("refresh_token", 
                            refresh_token, 
                            httponly=True,
                            domain="kong", 
                            max_age=7*24*3600)

        return response

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # 1. Lấy thông tin
        username = request.data.get("username")
        password = request.data.get("password")

        # 2. Xác thực user
        print("username: ",username)
        print("password: ", password)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        # 3. Lấy jwt credential tương ứng
        jwt_obj = JWTKey.objects.get(user=user)

        # 4. Trả về token 
        access_token, refresh_token = create_jwt(user, jwt_obj.key, jwt_obj.secret)
        info = {"user":({"username":user.username},{"_id":user.id})}
        response = Response(info, status=200)
        response.set_cookie("access_token", access_token, httponly=True, max_age=300)
        response.set_cookie("refresh_token", refresh_token, httponly=True, max_age=7*24*3600)
        return response


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        import jwt
        from jwt.exceptions import InvalidTokenError

        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)

        try:
            # Decode token để lấy user_id
            unverified = jwt.decode(refresh_token, options={"verify_signature": False})
            user_id = unverified.get("sub")
            user = User.objects.get(id=user_id)
            jwt_obj = JWTKey.objects.get(user=user)

            decoded = jwt.decode(refresh_token, jwt_obj.secret, algorithms=["HS256"])
            if decoded.get("type") != "refresh":
                raise InvalidTokenError()

            # Tạo lại token mới
            access_token, refresh_token = create_jwt(user, jwt_obj.key, jwt_obj.secret)

            response = Response({"message": "Refreshed"},status=200)
            response.set_cookie("access_token", access_token, httponly=True, max_age=300)
            response.set_cookie("refresh_token", refresh_token, httponly=True, max_age=7*24*3600)
            return response

        except (InvalidTokenError, User.DoesNotExist, JWTKey.DoesNotExist):
            return Response({"error": "Invalid refresh"}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def logoutUser(request):
    response = HttpResponse({"message": "Đăng xuất thành công!"})
    response.delete_cookie("access_token", path="/",domain="localhost")
    response.delete_cookie("refresh_token", path="/",domain="localhost")
    return response


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Likes.objects.filter(user=user)
    def perform_create(self, serializer):
        # Lấy đối tượng Novel từ serializer
        novel = serializer.validated_data['novel']
        
        # Kiểm tra xem người dùng đã thích truyện này chưa
        if Likes.objects.filter(user=self.request.user, novel=novel).exists():
            # Nếu đã có lượt thích rồi, trả về lỗi hoặc không làm gì
            return None
        # Nếu chưa có lượt thích, tiến hành lưu đối tượng Like và gắn người dùng hiện tại vào
        if serializer.is_valid():
            # Lưu đối tượng Like với người dùng hiện tại
            serializer.save(user=self.request.user)
            
            # Cập nhật số lượt thích cho Novel
            novel.numLikes += 1  # Tăng thêm 1 lượt thích
            novel.save(update_fields=['numLikes'])
            serializer.save(uploader=self.request.user)
    def perform_destroy(self, instance):
        # Truy cập đối tượng Novel liên quan đến Like
        novel = instance.novel
        
        # Giảm số lượt thích cho Novel
        novel.numLikes -= 1
        novel.save(update_fields=['numLikes'])  # Lưu lại sự thay đổi
        # Xóa đối tượng Like
        instance.delete()


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # Lọc các bình luận của người dùng hiện tại
        return Comments.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
    
            # Cập nhật số lượt thích cho Novel
            novel = serializer.validated_data['novel'] # Lấy đối tượng Novel từ Comment
            novel.numComments += 1  # Tăng thêm 1 lượt thích
            novel.save(update_fields=['numComments'])
            serializer.save(uploader=self.request.user)
        else: 
            print(serializer.errors)
    def perform_destroy(self, instance):
        # Truy cập đối tượng Novel liên quan đến Comments
        novel = instance.novel
        # Giảm số lượt thích cho Novel
        novel.numComments -= 1  # Giảm bớt 1 lượt thích
        novel.save(update_fields=['numComments'])  # Lưu lại sự thay đổi
        
        # Xóa đối tượng Comment
        instance.delete()
    

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Favorite.objects.filter(user=user)
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user) # 
            # Cập nhật số lượt thích cho Novel
            novel = serializer.validated_data['novel']
            novel.numFavorites += 1
            novel.save(update_fields=['numFavorites'])
            serializer.save(uploader=self.request.user)
        else: 
            print(serializer.errors)
    def perform_destroy(self, instance):
        # Truy cập đối tượng Novel liên quan đến Like
        novel = instance.novel
        
        # Giảm số lượt thích cho Novel
        novel.numFavorites -= 1  # Giảm bớt 1 lượt thích
        novel.save(update_fields=['numFavorites'])  # Lưu lại sự thay đổi
        
        # Xóa đối tượng Like
        instance.delete()
