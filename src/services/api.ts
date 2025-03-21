// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { NewsArticle, NewsResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

// Debug information
console.log('API Configuration:', {
    API_URL,
    NODE_ENV: process.env.NODE_ENV,
    allEnvVars: process.env
});

if (!API_URL) {
    console.error('REACT_APP_API_URL is not defined in environment variables');
}

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('Network Error:', {
                message: error.message,
                request: error.request
            });
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

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
    getStockNews: async (source?: string): Promise<any> => {
        try {
            const params = source ? { source } : {};
            const response = await apiClient.get('/news', { params });
            // Return the data as-is, let component handle formatting
            return response.data;
        } catch (error) {
            console.error('Error fetching stock news:', error);
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { detail: 'Failed to fetch stock news' };
        }
    },
    
    // Reddit breakout posts
    getRedditBreakouts: async (limit: number = 20): Promise<any> => {
        try {
            const response = await apiClient.get('/reddit/breakouts', { 
                params: { limit } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Reddit breakouts:', error);
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { detail: 'Failed to fetch Reddit breakouts' };
        }
    },

    // Breakout stock suggestions with LLM analysis
    getBreakoutSuggestions: async (params?: {
        subreddits?: string;
        limit?: number;
        flairs?: string;
        sentiment?: string;
        target_flairs?: string[];
        sentiment_phrases?: string[];
    }): Promise<any> => {
        try {
            // Convert arrays to comma-separated strings if needed
            const formattedParams = {
                ...params,
                target_flairs: params?.target_flairs?.join(','),
                sentiment_phrases: params?.sentiment_phrases?.join(',')
            };
            const response = await apiClient.get('/stocks/breakout-suggestions', { params: formattedParams });
            return response.data;
        } catch (error) {
            console.error('Error fetching breakout suggestions:', error);
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { detail: 'Failed to fetch breakout suggestions' };
        }
    },

    // Stock historical data for charts
    getStockHistoricalData: async (symbol: string, period: string = '1m'): Promise<any> => {
        try {
            const response = await apiClient.get(`/api/stock/${symbol}/historical`, { 
                params: { period } 
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching historical data for ${symbol}:`, error);
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { detail: `Failed to fetch historical data for ${symbol}` };
        }
    },

    // Multiple stocks historical data
    getWatchlistHistoricalData: async (period: string = '1m'): Promise<any> => {
        try {
            const response = await apiClient.get('/api/watchlist/historical', { 
                params: { period } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching watchlist historical data:', error);
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { detail: 'Failed to fetch watchlist historical data' };
        }
    }
};

export default api;