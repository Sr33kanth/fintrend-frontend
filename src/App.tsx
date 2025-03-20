// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Grid, Box, Typography, CssBaseline, Paper, AppBar, Toolbar, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import WatchlistCard from './components/Watchlist/WatchlistCard';
import LeftPane from './components/Layout/LeftPane';
import api from './services/api';
import logo from './assets/logo.png';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// Create a light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2962ff', // More vibrant blue
      light: '#768fff',
      dark: '#0039cb',
    },
    secondary: {
      main: '#00c853', // Success green
      light: '#5efc82',
      dark: '#009624',
    },
    background: {
      default: '#f5f7fa', // Slightly blue-tinted background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Main Dashboard Component
const Dashboard = () => {
  // State management
  const [stocks, setStocks] = React.useState<string[]>([]);
  const [news, setNews] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newsSource, setNewsSource] = React.useState<string | null>(null);

  // Fetch initial data
  React.useEffect(() => {
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
      const stockList = Array.isArray(updatedWatchlist) ? updatedWatchlist : [];
      setStocks(stockList);
      
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
      const stockList = Array.isArray(updatedWatchlist) ? updatedWatchlist : [];
      setStocks(stockList);
      
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
    if (source !== newsSource) {
      setLoading(true);
      setNewsSource(source);
    }
  };

  return (
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
  );
};

// Main App Component
const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            backdropFilter: 'blur(20px)',
            background: alpha('#fff', 0.95),
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                minHeight: { xs: 64, sm: 70 },
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChartIcon 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: { xs: 28, sm: 32 },
                    mr: 1 
                  }} 
                />
                <Typography 
                  variant="h1" 
                  sx={{
                    background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  }}
                >
                  FinTrend
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2,
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Market Intelligence Platform
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Dashboard />
        </Box>
        
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: theme => theme.palette.divider,
            textAlign: 'center',
            mt: 'auto'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            FinTrend © {new Date().getFullYear()} • Market Intelligence Platform
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;