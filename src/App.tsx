// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, CssBaseline, Paper, AppBar, Toolbar, IconButton, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Layout/Header';
import WatchlistCard from './components/Watchlist/WatchlistCard';
import LeftPane from './components/Layout/LeftPane';
import api from './services/api';
import { NewsArticle, NewsResponse } from './types';
import logo from './assets/logo.png'; // Correct path

// Create a light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  // State management
  const [stocks, setStocks] = useState<string[]>([]);
  const [news, setNews] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const watchlist = await api.getWatchlist();
        const stockList = Array.isArray(watchlist) ? watchlist : [];
        setStocks(stockList);
        if (stockList.length > 0) {
          const newsData = await api.getStockNews(newsSource || undefined);
          setNews(newsData);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.detail || 'Failed to load data');
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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="fixed" color="default" elevation={3} sx={{ bgcolor: '#1976d2' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="FinTrend" style={{ height: 60, marginRight: 16 }} />
              <Typography variant="h1" color="white" sx={{ display: { xs: 'none', sm: 'block' } }}>
                FinTrend
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for fixed AppBar */}
        
        <Container component="main" sx={{ 
          flexGrow: 1, 
          py: 4,
          px: { xs: 1, sm: 2, md: 3 },
          mt: 2
        }}>
          {error ? (
            <Typography color="error" align="center" sx={{ my: 4 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <LeftPane 
                    news={news} 
                    loading={loading} 
                    selectedSource={newsSource}
                    onSourceChange={handleSourceChange}
                    onAddToWatchlist={handleAddStock}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <WatchlistCard 
                    stocks={stocks} 
                    onAddStock={handleAddStock} 
                    onRemoveStock={handleRemoveStock} 
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: theme => theme.palette.divider,
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2" color="text.secondary">
            FinTrend &copy; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;