// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { NewsArticle, NewsResponse } from '../types';

const API_URL = 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to ensure response is an array
const ensureArray = <T>(data: any, defaultValue: T[] = []): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return defaultValue;
};

// Define API service
const api = {
  // Watchlist operations
  getWatchlist: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/watchlist');
      return ensureArray<string>(response.data, []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { detail: 'Failed to fetch watchlist' };
    }
  },
  
  addToWatchlist: async (symbol: string): Promise<string[]> => {
    try {
      const response = await apiClient.post('/watchlist/add', { symbol });
      return ensureArray<string>(response.data, []);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { detail: 'Failed to add stock to watchlist' };
    }
  },
  
  removeFromWatchlist: async (symbol: string): Promise<string[]> => {
    try {
      const response = await apiClient.delete('/watchlist/remove', { 
        data: { symbol } 
      });
      return ensureArray<string>(response.data, []);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { detail: 'Failed to remove stock from watchlist' };
    }
  },
  
  // News operations
  getStockNews: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/news');
      // Return the data as-is, let component handle formatting
      return response.data;
    } catch (error) {
      console.error('Error fetching stock news:', error);
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { detail: 'Failed to fetch stock news' };
    }
  }
};

export default api;