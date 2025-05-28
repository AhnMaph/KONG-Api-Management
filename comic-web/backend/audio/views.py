import os, re
from django.http import HttpResponse, JsonResponse,FileResponse
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.permissions import AllowAny
from rest_framework import status
from chapter.models import NovelChapter
from gtts import gTTS
import json
from django.views.decorators.csrf import csrf_exempt
import re


def slugify_vietnamese(text: str) -> str:
    """
    Hàm sử lý content từ audio
    """
    from_chars = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ"
    to_chars   = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy"

    text = text.lower()
    translation_table = str.maketrans(from_chars, to_chars)
    text = text.translate(translation_table)

    text = re.sub(r'\s+', '-', text)               # thay space bằng dấu gạch ngang
    text = re.sub(r'[^a-z0-9\-]', '', text)        # chỉ giữ a-z, 0-9 và dấu gạch ngang
    text = re.sub(r'^-+|-+$', '', text)            # loại bỏ dấu '-' ở đầu hoặc cuối

    return text

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
        id = filename.replace(".mp3", "")
        chapter = NovelChapter.objects.filter(_id=id)
        text = slugify_vietnamese(chapter.content)
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

