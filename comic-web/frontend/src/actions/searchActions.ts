import axios from 'axios';
import { AdvancedFilter } from "../types/search/advanceSearch";
import { Novel } from '../types/novel/novelDetails';
const baseURL = 'http://localhost:8000';
export const searchKeyword = async(query:string,type:string) =>{
    try
    {
        if (type != "manga" &&type != "audio"&&type != "novel") console.error("Error type not available");
        console.log("URL: ",`${baseURL}/api/${type}/?q=${query}`)
        const response = await axios.get(`${baseURL}/api/${type}/?q=${query}`)
        console.log("DATA: ",response.data)
        return response.data.results;
    }
    catch(error)
    {
        console.error("Unable to search content, error: ",error);
    }

}
export const fetchAdvancedSearch = async (filters: AdvancedFilter,type:string): Promise<Novel[]> => {
    try {
        if(type != "manga" &&type != "audio"&&type != "novel")
            console.error("Error type not available");
        
        const query = new URLSearchParams();
        Object.entries(filters.genres).forEach(([genreId, state]) => {
            if(state ===1) query.append("include_genres", genreId);
            else if(state ===2) query.append("exclude_genres", genreId);
        });
        
        if (filters.minChapters) query.set("min_chapters", filters.minChapters.toString());
        if (filters.maxChapters) query.set("min_chapters", filters.maxChapters.toString());
        if (filters.author) query.set("author", filters.author);
        if (filters.status) query.set("status", filters.status);
        const response = await axios.get(`${baseURL}/api/${type}/advanced-search?${query}`);
        console.log("Advance search",response.data);
        return response.data.results;
    } catch (error) {
        console.error("Failed to fetch advanced search results:", error);
        return [];
    }
} 