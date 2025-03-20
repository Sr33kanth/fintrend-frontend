import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface BreakoutAnalysisProps {
  data: any;
  onAddToWatchlist: (symbol: string) => Promise<void>;
}

export const BreakoutAnalysis: React.FC<BreakoutAnalysisProps> = ({ data, onAddToWatchlist }) => {
  if (!data || !data.length) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        No breakout stocks found
      </Typography>
    );
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {data.map((stock: any, index: number) => (
        <React.Fragment key={stock.symbol}>
          <ListItem
            alignItems="flex-start"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {stock.symbol}
                  </Typography>
                  <Chip
                    label="Add to Watchlist"
                    onClick={() => onAddToWatchlist(stock.symbol)}
                    color="primary"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon color="primary" />
                        <Typography variant="body2">
                          Current Price: {formatPrice(stock.currentPrice)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShowChartIcon color="info" />
                        <Typography variant="body2">
                          Volume: {stock.volume.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon 
                          color={stock.priceChange >= 0 ? "success" : "error"} 
                        />
                        <Typography variant="body2">
                          Change: {formatPercentage(stock.priceChange)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon 
                          color={stock.volumeChange >= 0 ? "success" : "error"} 
                        />
                        <Typography variant="body2">
                          Volume Change: {formatPercentage(stock.volumeChange)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {stock.technicalIndicators && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Technical Indicators:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(stock.technicalIndicators).map(([key, value]: [string, any]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          size="small"
                          color={value === 'Buy' ? 'success' : value === 'Sell' ? 'error' : 'default'}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </ListItem>
          {index < data.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default BreakoutAnalysis; 