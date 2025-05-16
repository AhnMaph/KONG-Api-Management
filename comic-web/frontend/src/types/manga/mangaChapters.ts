export interface MangaChapterImage
{
    _id: string;
    image: string;
    page: number;
}

export interface MangaChapter {
    _id: string;
    manga: string;
    title: string;
    chapter_number: number;
    created_at: string;
    images: MangaChapterImage[];
     // Thêm 2 trường optional cho điều hướng
    previousChapterId?: string | null;
    nextChapterId?: string | null;
}

  