// src/App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container, Grid, Box, Typography, CssBaseline, Paper, AppBar, Toolbar, IconButton, useTheme, useMediaQuery, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import WatchlistCard from './components/Watchlist/WatchlistCard';
import WatchlistCharts from './components/Watchlist/WatchlistCharts';
import WatchlistChartsTest from './components/Watchlist/WatchlistChartsTest';
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
  const [activeTab, setActiveTab] = React.useState<number>(0);

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

  // Handler for tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
        <>
          {/* Tab navigation for different sections */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="News & Analysis" />
              <Tab label="Stock Charts" />
            </Tabs>
          </Box>

          {/* News and Analysis Tab */}
          {activeTab === 0 && (
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

          {/* Stock Charts Tab */}
          {activeTab === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                    }}
                  >
                    <WatchlistCard 
                      stocks={stocks} 
                      onAddStock={handleAddStock} 
                      onRemoveStock={handleRemoveStock} 
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  {stocks.length > 0 ? (
                    <WatchlistCharts stocks={stocks} />
                  ) : (
                    <Paper 
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Stocks in Watchlist
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Add stocks to your watchlist to see their price charts.
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </>
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
                    fontSize: { xs: 24, md: 28 }
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '.05rem',
                    color: 'primary.main',
                    textDecoration: 'none',
                    display: 'flex',
                    gap: '0.25rem',
                    alignItems: 'baseline'
                  }}
                >
                  <Box component="span" sx={{ color: 'primary.main' }}>Fin</Box>
                  <Box component="span" sx={{ color: 'secondary.main' }}>Trend</Box>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Add any header actions here */}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, sm: 9 },
            pb: 4,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test" element={<WatchlistChartsTest />} />
            {/* You could add more routes here in the future */}
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;