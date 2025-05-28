import os, re
from django.http import HttpResponse, FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from chapter.models import NovelChapter

from gtts import gTTS
import json

from django.views.decorators.csrf import csrf_exempt
import re

# --- Chương trình làm sạch dữ liệu  cho chapter ---
def clean_vietnamese_tts_text(text: str) -> str:
    # Remove HTML tags or markdown (e.g., **bold** or <div>)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    
    # Remove emojis and unusual Unicode symbols
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    text = re.sub(r'[·•●◦▪️┃]', '', text)

    # Remove URLs
    text = re.sub(r'http\S+|www\S+|fb\.com\S+|\S+\.(com|vn|org)\S*', '', text)

    # Remove common informal prefixes/suffixes or chat language
    pattern = re.compile(r'\bm(n|ik|t|mik|cj|k)\b', re.IGNORECASE)
    text = pattern.sub('', text)

    # Remove non-writing symbols (common in UI/chat but not prose)
    text = re.sub(r'[=@#$%^*_~<>\\|{}\[\]]+', '', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    # Standardize punctuation
    text = re.sub(r'\.{3,}', '...', text)
    text = re.sub(r'[!?]{2,}', lambda m: m.group(0)[0], text)  # keep one ? or !
    text = re.sub(r'[“”"\'`]', '', text)

    # Remove content in brackets often used for meta info
    text = re.sub(r'\[(.*?)\]', '', text)
    text = re.sub(r'\((.*?)\)', '', text)

    # Collapse multiple newlines into double line breaks (for natural pause)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'\n+', '\n', text)

    return text.strip()


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def text_to_speech(request,filename):
    """
    POST  /api/audio/tts/filename/  → tạo hoặc tái sử dụng file, rồi chuyển sang GET
    GET   /api/audio/tts/filename/  → stream hỗ trợ Range
    """
    # --- Nếu POST: tạo file rồi chuyển thành redirect sang GET ---
    try: 
        dir_path = os.path.join('backend','media', 'temp')
        os.makedirs(dir_path, exist_ok=True)
        path = os.path.join(dir_path, filename)
            
        if request.method == 'POST':
            id = filename.replace(".mp3", "")
            chapter = NovelChapter.objects.filter(_id=id).first()
            if chapter:
                text = clean_vietnamese_tts_text(chapter.content)
            else:
                return HttpResponse(status=404, content='Chapter not found')
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
    except Exception as e:
        return Response({'details': f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

