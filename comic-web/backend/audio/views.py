import os, re
from django.http import HttpResponse, JsonResponse,FileResponse
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.permissions import AllowAny
from rest_framework import status
from gtts import gTTS
import json
from django.views.decorators.csrf import csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def text_to_speech(request,filename):
    """
    POST  /api/audio/tts/filename/  → tạo hoặc tái sử dụng file, rồi chuyển sang GET
    GET   /api/audio/tts/filename/  → stream hỗ trợ Range
    """
    # --- Nếu POST: tạo file rồi chuyển thành redirect sang GET ---
    dir_path = os.path.join('media', 'temp')
    os.makedirs(dir_path, exist_ok=True)
    path = os.path.join(dir_path, filename)
        
    if request.method == 'POST':
        data = json.loads(request.body)
        text = data.get('text', '')
        if not text:
            return HttpResponse(status=400, content='Missing text')
        if not os.path.exists(path):
            gTTS(text, lang='vi').save(path)
        return HttpResponse(status=201, headers={'Location': f'/api/audio/tts/{filename}'})
    # --- Nếu GET: stream file, xử lý Range ---
    if not os.path.exists(path):
        return HttpResponse(status=404)
    file = open(path, 'rb')
    response = FileResponse(file, content_type='audio/mpeg')
    response['Accept-Ranges'] = 'bytes'
    print(f"[LOG] Headers response: {response.headers}")
    return response

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def text_to_speech(request):
#     try:
#         # print("test")
#         data = json.loads(request.body)
#         text = data.get('text', '')
#         name = data.get('name', '')
#         if not text:
#             return JsonResponse({'error': 'Missing text'}, status=400)
#         filename = f"{name}.mp3"
#         dir_path = os.path.join("media", "temp")
#         os.makedirs(dir_path, exist_ok=True)
#         path = os.path.join(dir_path, filename)
#         if os.path.exists(path):
#             print(f"[LOG] File tồn tại: {path}")
#         else:
#             tts = gTTS(text, lang='vi')
#             tts.save(path)
#             print(f"[LOG] File không tồn tại: {path}")
#         return FileResponse(open(path, 'rb'), content_type='audio/mpeg', filename=filename)
          
#     except Exception as e:
#         return Response({'error': f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# @api_view(['POST'])
# @permission_classes([AllowAny]) # không nên allow any không an toàn @AhnMaph
# def delete_temp_audio(request):
#     try:
#         data = json.loads(request.body)
#         file = data.get("file", "")
#         file_path = os.path.join("media", "temp", os.path.basename(file))
#         if os.path.exists(file_path):
#             os.remove(file_path)
#         return JsonResponse({"status": "deleted"})
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
# @csrf_exempt
# @api_view(['POST'])  
# @permission_classes([AllowAny])
# def text_to_speech(request, filename):
#     try:
#         dir_path = os.path.join("media", "temp")
#         os.makedirs(dir_path, exist_ok=True)
#         response_data = json.loads(request.body)
#         text = response_data.get('text', '')
#         if not text:
#             return JsonResponse({'error': 'Missing text'}, status=400)
#         print(f"[LOG] Tạo file mp3 mới: {path}")
#         path = os.path.join(dir_path, filename)
#         if os.path.exists(path):
#             print(f"[LOG] Tồn tại file mp3: {path}")

#             file = open(path, 'rb')
#             response = FileResponse(file, content_type='audio/mpeg')
#             response['Accept-Ranges'] = 'bytes'
            
#             print(f"[LOG] Headers response: {response.headers}")
#             return response
#         else:
#             tts = gTTS(text, lang='vi')
#             tts.save(path)
#     except Exception as e:
#         return HttpResponse({'error': f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
    