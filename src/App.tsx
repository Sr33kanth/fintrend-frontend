// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Layout/Header';
import WatchlistCard from './components/Watchlist/WatchlistCard';
import LeftPane from './components/Layout/LeftPane';
import api from './services/api';
import { NewsArticle, NewsResponse } from './types';

// Create theme outside of component to avoid re-creation on each render
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  // State management
  const [stocks, setStocks] = useState<string[]>([]);
  const [news, setNews] = useState<any>({}); // Use any to handle various response formats
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Get watchlist
        const watchlist = await api.getWatchlist();
        // Ensure watchlist is an array
        const stockList = Array.isArray(watchlist) ? watchlist : [];
        setStocks(stockList);
        
        // Get news if there are stocks in the watchlist
        if (stockList.length > 0) {
          try {
            const newsData = await api.getStockNews(newsSource || undefined);
            // Store the news data as-is, let the NewsCard component handle formatting
            setNews(newsData);
          } catch (newsErr) {
            console.error("Error fetching news:", newsErr);
            setNews({});
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.detail || 'Failed to load data');
        // Initialize with empty arrays on error
        setStocks([]);
        setNews({});
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [newsSource]);

  // Handler for adding a stock
  const handleAddStock = async (symbol: string): Promise<void> => {
    try {
      const updatedWatchlist = await api.addToWatchlist(symbol);
      // Ensure watchlist is an array
      const stockList = Array.isArray(updatedWatchlist) ? updatedWatchlist : [];
      setStocks(stockList);
      
      // Refresh news after adding a stock
      if (stockList.length > 0) {
        try {
          const newsData = await api.getStockNews(newsSource || undefined);
          setNews(newsData);
        } catch (newsErr) {
          console.error("Error fetching news:", newsErr);
        }
      }
    } catch (err: any) {
      console.error("Error adding stock:", err);
      throw err;
    }
  };

  // Handler for removing a stock
  const handleRemoveStock = async (symbol: string): Promise<void> => {
    try {
      const updatedWatchlist = await api.removeFromWatchlist(symbol);
      // Ensure watchlist is an array
      const stockList = Array.isArray(updatedWatchlist) ? updatedWatchlist : [];
      setStocks(stockList);
      
      // Refresh news after removing a stock
      if (stockList.length > 0) {
        try {
          const newsData = await api.getStockNews(newsSource || undefined);
          setNews(newsData);
        } catch (newsErr) {
          console.error("Error fetching news:", newsErr);
        }
      } else {
        setNews({});
      }
    } catch (err: any) {
      console.error("Error removing stock:", err);
      throw err;
    }
  };

  // Handler for changing news source filter
  const handleSourceChange = (source: string | null) => {
    // Only set loading if we're actually changing the source
    if (source !== newsSource) {
      setLoading(true);
      setNewsSource(source);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          {error ? (
            <Typography color="error" align="center" sx={{ my: 4 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <LeftPane 
                  news={news} 
                  loading={loading} 
                  selectedSource={newsSource}
                  onSourceChange={handleSourceChange}
                  onAddToWatchlist={handleAddStock}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <WatchlistCard 
                  stocks={stocks} 
                  onAddStock={handleAddStock} 
                  onRemoveStock={handleRemoveStock} 
                />
              </Grid>
            </Grid>
          )}
        </Container>
        <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Finance Trend App &copy; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;