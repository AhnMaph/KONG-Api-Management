import axios from 'axios';
//import { Dispatch } from 'redux';
import { Novel } from '../types/novel/novelDetails';
const baseURL = 'http://localhost:8000';

export const fetchStoryDetails = async (novelid: string) => {
    try{
      const response = await axios.get(`${baseURL}/api/novel/${novelid}`)
      console.log("novel details:");
      console.log(response.data);
      return response.data;
    }
    catch (error) {
        console.error("Error fetching story details:", error);
        throw error;
    }
};

export const fetchStoryChapters = async (novelid: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/novel/${novelid}/chapters`);
    console.log("list chapters:");
    console.log(response.data);
    return response.data;
  }

  catch (error) { 
    console.error("Error fetching story chapters:", error);
    throw error;
  }

};

export const fetchChapterDetail = async (chapterId: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/novel/chapter/${chapterId}`);
    console.log("chapter details:");
    console.log(response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching chapter detail:", error);
    throw error;
  }
};

export const updateNumberFavorite  = async (novelid: string) => {
  try{
      //const response = await axios.post(`${baseURL}/api/novel/baa9a61e-35d5-4ac1-9d55-1fbfefbc21ef/updateNumFavorite/`);
      const response = await axios.put(`${baseURL}/api/novel/${novelid}/updateNumFavorite/`);
      console.log(response.data);
      return response.data;
  }

  catch (error) {
    console.error("Error update number favorite:", error);
    throw error;
  }
}

export const updateNumberComments = async (novelid: string) => {
  try {
      const response = await axios.put(`${baseURL}/api/novel/${novelid}/updateNumComments/`);
      console.log(response.data);
      return response.data;
  } 
  
  catch (error) {
      console.error("Error updating number of comments:", error);
      throw error;
  }
}


export const fetchNovel = async (page=1): Promise<Novel[]> => {
    try {
            const response = await axios.get(`${baseURL}/api/novel/?page=${page}`);
            console.log(response)
            console.log(`${baseURL}/api/novel/?page=${page}`)
            const data = await response.data
            return Array.isArray(data.results) ? data.results : [];
        } catch (error) {
            console.error("Failed to fetch novel:", error);
            return [];
        }
};
