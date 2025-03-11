// src/components/News/NewsCard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Typography, 
  Box, 
  CircularProgress, 
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { NewsArticle } from '../../types';
import NewsItem from './NewsItem';

interface NewsCardProps {
  news: NewsArticle[] | object | null | undefined;
  loading: boolean;
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, loading, selectedSource, onSourceChange }) => {
  // State to track available sources
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  // State to track the current select value
  const [selectValue, setSelectValue] = useState<string>('all');
  
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
  
  // Extract unique sources for the filter dropdown
  useEffect(() => {
    if (newsItems.length > 0) {
      // Get all unique sources
      const uniqueSources = Array.from(new Set(newsItems.map(item => item.source || '')));
      
      // Check if there are any Reddit sources
      const hasRedditSource = uniqueSources.some(source => 
        source.toLowerCase().includes('reddit')
      );
      
      // If there are Reddit sources, add a single "reddit" option
      const finalSources = hasRedditSource 
        ? [...uniqueSources.filter(source => !source.toLowerCase().includes('reddit')), 'reddit']
        : uniqueSources;
      
      setAvailableSources(finalSources);
    } else {
      setAvailableSources([]);
    }
  }, [newsItems]);
  
  // Update the select value when selectedSource or availableSources change
  useEffect(() => {
    if (loading) {
      // Don't update during loading to prevent flickering
      return;
    }
    
    if (!selectedSource) {
      setSelectValue('all');
      return;
    }
    
    // Check if the selected source is available
    const isAvailable = availableSources.includes(selectedSource);
    
    if (isAvailable) {
      setSelectValue(selectedSource);
    } else if (selectedSource === 'reddit' && availableSources.some(s => s.toLowerCase().includes('reddit'))) {
      // If the selected source is 'reddit' and there are Reddit sources available
      setSelectValue('reddit');
    } else {
      // If the selected source is not available, reset to 'all'
      setSelectValue('all');
      onSourceChange(null);
    }
  }, [selectedSource, availableSources, loading, onSourceChange]);
  
  // Handle source filter change
  const handleSourceChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectValue(value); // Update local state immediately
    onSourceChange(value === 'all' ? null : value);
  };
  
  return (
    <Card elevation={2}>
      <CardHeader
        avatar={<NewspaperIcon color="primary" />}
        title="Latest News"
        subheader={loading ? 'Loading news...' : `${newsItems.length} articles`}
        action={
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="source-filter-label">Source</InputLabel>
            <Select
              labelId="source-filter-label"
              id="source-filter"
              value={selectValue}
              label="Source"
              onChange={handleSourceChange}
              disabled={loading || availableSources.length === 0}
            >
              <MenuItem value="all">All Sources</MenuItem>
              {availableSources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source === 'reddit' ? 'Reddit' : source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
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