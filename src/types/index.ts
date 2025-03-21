// src/types/index.ts

// News article interface
export interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: string;
  symbol?: string; // Optional property to track which stock this news belongs to
  id?: string;     // Optional ID for React keys
  platform?: string; // Optional property to track the platform (finnhub, reddit, etc.)
  subreddit?: string; // Optional property for Reddit posts to track the subreddit
}

// News response structure from API
export interface NewsResponse {
  [symbol: string]: NewsArticle[];
}

// Error response from API
export interface ApiError {
  status: number;
  detail: string;
}

// Historical stock data interface
export interface HistoricalData {
  symbol: string;
  period: string;
  dates: string[];
  prices: number[];
  volumes: number[];
}

// Watchlist historical data response structure from API
export interface WatchlistHistoricalData {
  [symbol: string]: HistoricalData;
}

// ChartData for Recharts
export interface ChartData {
  date: string;
  price: number;
  volume?: number;
}