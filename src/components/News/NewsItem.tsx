// src/components/News/NewsItem.tsx
import React from 'react';
import { Card, CardContent, Typography, Link, Box, Chip } from '@mui/material';
import { NewsArticle } from '../../types';

interface NewsItemProps {
  article: NewsArticle;
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  // Extract properties using the correct field names from the API
  const { headline, url, source, datetime, summary, symbol } = article;
  
  // Format the published date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Link 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="hover" 
            color="inherit"
          >
            {headline}
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          {symbol && (
            <Chip
              label={symbol}
              size="small"
              color="primary"
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {source} • {formatDate(datetime)}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsItem;