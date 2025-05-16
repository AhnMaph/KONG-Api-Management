import axios from 'axios';
//import { Dispatch } from 'redux';
import { Manga } from '../types/manga/mangaDetails'; 
import { MangaChapter } from '../types/manga/mangaChapters'; 
import { AdvancedFilter } from "../types/search/advanceSearch";
const baseURL = 'http://localhost:8000';

// string id = "baa9a61e-35d5-4ac1-9d55-1fbfefbc21ef";

export const fetchMangaDetails = async (mangaid: string) => {
    try{
      const response = await axios.get(`${baseURL}/api/manga/${mangaid}`)
      //const response = await axios.get(`${baseURL}/api/novel/baa9a61e-35d5-4ac1-9d55-1fbfefbc21ef`)
      console.log("manga details:");
      console.log(response.data);
      return response.data;
    }
    catch (error) {
        console.error("Error fetching manga details:", error);
        throw error;
    }
};

export const fetchMangaChapters = async (mangaid: string) => {
  try {
    //const response = await axios.get(`${baseURL}/api/novel/baa9a61e-35d5-4ac1-9d55-1fbfefbc21ef/chapters`);
    const response = await axios.get(`${baseURL}/api/manga/${mangaid}/chapters`);
    console.log("list chapters:");
      console.log(response.data);
      return response.data;
  }

  catch (error) { 
    console.error("Error fetching manga chapters:", error);
    throw error;
  }

};

export const fetchMangaChapterDetail = async (chapterId: string) => {
  try {
    //const response = await axios.get(`${baseURL}/api/novel/chapters/${chapterId}`);
    const response = await axios.get(`${baseURL}/api/manga/chapter/${chapterId}`);
    console.log("chapter details:");
    console.log(response.data);

    const raw = response.data;
    const chapter: MangaChapter = {
      _id: raw._id,
      manga: raw.manga,
      title: raw.title,
      chapter_number: raw.chapter_number,
      created_at: raw.created_at,
      images: raw.chapterImages, // Ánh xạ đúng với interface
      previousChapterId: raw.previousChapterId ?? null,
      nextChapterId: raw.nextChapterId ?? null,
    };
    return chapter;
  }
  catch (error) {
    console.error("Error fetching chapter detail:", error);
    throw error;
  }
};

export const updateNumberFavoriteManga  = async (novelid: string) => {
  try{
      //const response = await axios.post(`${baseURL}/api/novel/baa9a61e-35d5-4ac1-9d55-1fbfefbc21ef/updateNumFavorite/`);
      const response = await axios.put(`${baseURL}/api/manga/${novelid}/updateNumFavorite/`);
      console.log(response.data);
      return response.data;
  }

  catch (error) {
    console.error("Error update number favorite:", error);
    throw error;
  }
}
const API_BASE_URL = 'http://127.0.0.1:8000/api/manga/'
export const fetchManga = async (page=1): Promise<Manga[]> => {
    try {
            const response = await axios.get(API_BASE_URL+"?page="+page);
            console.log(response)
            console.log(API_BASE_URL+"?page="+page)
            const data = await response.data
            return Array.isArray(data.results) ? data.results : [];
        } catch (error) {
            console.error("Failed to fetch novel:", error);
            return [];
        }
};
export const fetchAdvancedSearch = async (filters: AdvancedFilter): Promise<Manga[]> => {
    try {
        const query = new URLSearchParams();
        Object.entries(filters.genres).forEach(([genreId, state]) => {
            if(state ===1) query.append("include_genres", genreId);
            else if(state ===2) query.append("exclude_genres", genreId);
        });
        
        if (filters.minChapters) query.set("min_chapters", filters.minChapters.toString());
        if (filters.maxChapters) query.set("min_chapters", filters.maxChapters.toString());
        if (filters.author) query.set("author", filters.author);
        if (filters.status) query.set("status", filters.status);
        const response = await axios.get(`${API_BASE_URL}advanced-search?${query}/`);
        console.log(response.data);
        return response.data.results;
    } catch (error) {
        console.error("Failed to fetch advanced search results:", error);
        return [];
    }
} 