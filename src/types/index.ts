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