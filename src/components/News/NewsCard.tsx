// src/components/News/NewsCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, Divider, Typography, Box, CircularProgress, Stack } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { NewsArticle } from '../../types';
import NewsItem from './NewsItem';

interface NewsCardProps {
  news: NewsArticle[] | object | null | undefined;
  loading: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, loading }) => {
  // Process news data to handle all possible formats
  let newsItems: NewsArticle[] = [];
  
  if (Array.isArray(news)) {
    // If news is already an array, use it directly
    newsItems = news;
  } else if (news && typeof news === 'object' && !Array.isArray(news)) {
    // If news is an object with stock symbols as keys
    try {
      Object.entries(news).forEach(([symbol, articles]) => {
        if (Array.isArray(articles)) {
          articles.forEach(article => {
            if (article && typeof article === 'object') {
              newsItems.push({
                ...article,
                symbol: symbol
              });
            }
          });
        }
      });
    } catch (error) {
      console.error("Error processing news data:", error);
    }
  }
  
  return (
    <Card elevation={2}>
      <CardHeader
        avatar={<NewspaperIcon color="primary" />}
        title="Latest News"
        subheader={loading ? 'Loading news...' : `${newsItems.length} articles`}
      />
      <Divider />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : newsItems.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No news available for your watchlist. Add stocks to see related news.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {newsItems.map((article, index) => (
              <NewsItem key={index} article={article} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;