import React from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import WatchlistCharts from './WatchlistCharts';
import api from '../../services/api';

const WatchlistChartsTest: React.FC = () => {
  const [stocks, setStocks] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const watchlist = await api.getWatchlist();
        setStocks(watchlist);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching watchlist:', err);
        setError(err.detail || 'Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleAddTestStock = async () => {
    try {
      const testStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
      const stockToAdd = testStocks.find(s => !stocks.includes(s)) || 'AAPL';
      const updatedWatchlist = await api.addToWatchlist(stockToAdd);
      setStocks(updatedWatchlist);
    } catch (err: any) {
      console.error('Error adding test stock:', err);
      setError(err.detail || 'Failed to add test stock');
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    try {
      const updatedWatchlist = await api.removeFromWatchlist(symbol);
      setStocks(updatedWatchlist);
    } catch (err: any) {
      console.error('Error removing stock:', err);
      setError(err.detail || 'Failed to remove stock');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WatchlistCharts Test
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Controls
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <button onClick={handleAddTestStock}>
            Add Test Stock
          </button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Current Watchlist: {stocks.join(', ') || 'Empty'}
        </Typography>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {stocks.length > 0 ? (
            <WatchlistCharts stocks={stocks} />
          ) : (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No stocks in watchlist
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add test stocks using the control above to test the charts functionality.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WatchlistChartsTest; 