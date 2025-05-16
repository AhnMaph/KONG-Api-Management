import {Novel} from './novelDetails';
export interface NovelChapter {
    _id: string;
    novel: Novel;
    title: string;
    chapter_number: number;
    content: string;
    created_at: string;
     // Thêm 2 trường optional cho điều hướng
  previousChapterId?: string | null;
  nextChapterId?: string | null;
}

  