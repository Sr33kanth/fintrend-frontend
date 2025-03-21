import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  ButtonGroup, 
  Button, 
  CircularProgress, 
  Skeleton
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

interface StockChartProps {
  symbol: string;
  initialPeriod?: string;
}

// Interface for the formatted chart data
interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, initialPeriod = '1m' }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(initialPeriod);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const data = await api.getStockHistoricalData(symbol, period);
        
        // Transform data for Recharts
        const formattedData = data.dates.map((date: string, index: number) => ({
          date: date,
          price: data.prices[index],
          volume: data.volumes[index]
        }));
        
        setChartData(formattedData);
        setError(null);
      } catch (err: any) {
        console.error(`Failed to fetch data for ${symbol}:`, err);
        setError(err.detail || err.message || 'Error fetching stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  // Function to format dates on X-axis based on the period
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (period === '5d' || period === '1d') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === '1m' || period === '3m') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  // Calculate price change and percentage for display
  const calculatePriceChange = () => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 };
    
    const startPrice = chartData[0]?.price || 0;
    const endPrice = chartData[chartData.length - 1]?.price || 0;
    const change = endPrice - startPrice;
    const changePercent = startPrice !== 0 ? (change / startPrice) * 100 : 0;
    
    return { change, changePercent };
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1, 
          border: '1px solid #ccc', 
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {new Date(data.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="primary">
            Price: ${data.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Volume: {data.volume.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const { change, changePercent } = calculatePriceChange();
  const isPositive = change >= 0;
  const latestPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;

  return (
    <Card sx={{ mb: 2, height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">
            {symbol}
          </Typography>
          {!loading && (
            <Typography 
              variant="body1" 
              color={isPositive ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              ${latestPrice.toFixed(2)} {' '}
              <Typography component="span" variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
                {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </Typography>
            </Typography>
          )}
        </Box>
        
        {loading ? (
          <Box height="250px" display="flex" flexDirection="column" justifyContent="center">
            <Skeleton variant="rectangular" height={200} animation="wave" />
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={24} />
            </Box>
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="250px">
            <Typography color="error">Error: {error}</Typography>
          </Box>
        ) : (
          <Box height="250px" width="100%" mt={2}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <defs>
                  <linearGradient id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? "#4CAF50" : "#F44336"} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? "#4CAF50" : "#F44336"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12 }}
                  tickCount={5}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? "#4CAF50" : "#F44336"} 
                  fill={`url(#color${symbol})`}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
        
        <Box mt={2}>
          <ButtonGroup size="small" variant="outlined" fullWidth>
            <Button 
              onClick={() => handlePeriodChange('1d')}
              variant={period === '1d' ? 'contained' : 'outlined'}
              color={period === '1d' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '1d' ? 'bold' : 'normal' }}
            >
              1D
            </Button>
            <Button 
              onClick={() => handlePeriodChange('5d')}
              variant={period === '5d' ? 'contained' : 'outlined'}
              color={period === '5d' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '5d' ? 'bold' : 'normal' }}
            >
              5D
            </Button>
            <Button 
              onClick={() => handlePeriodChange('1m')}
              variant={period === '1m' ? 'contained' : 'outlined'}
              color={period === '1m' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '1m' ? 'bold' : 'normal' }}
            >
              1M
            </Button>
            <Button 
              onClick={() => handlePeriodChange('3m')}
              variant={period === '3m' ? 'contained' : 'outlined'}
              color={period === '3m' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '3m' ? 'bold' : 'normal' }}
            >
              3M
            </Button>
            <Button 
              onClick={() => handlePeriodChange('6m')}
              variant={period === '6m' ? 'contained' : 'outlined'}
              color={period === '6m' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '6m' ? 'bold' : 'normal' }}
            >
              6M
            </Button>
            <Button 
              onClick={() => handlePeriodChange('1y')}
              variant={period === '1y' ? 'contained' : 'outlined'}
              color={period === '1y' ? 'primary' : 'inherit'}
              sx={{ fontWeight: period === '1y' ? 'bold' : 'normal' }}
            >
              1Y
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockChart; 