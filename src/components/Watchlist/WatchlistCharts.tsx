import React, { useState } from 'react';
import { Grid, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StockChart from './StockChart';

interface WatchlistChartsProps {
  stocks: string[];
}

const WatchlistCharts: React.FC<WatchlistChartsProps> = ({ stocks }) => {
  const [globalPeriod, setGlobalPeriod] = useState('1m');

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setGlobalPeriod(event.target.value as string);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShowChartIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Price Charts</Typography>
        </Box>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="period-select-label">Time Period</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={globalPeriod}
            onChange={handlePeriodChange}
            label="Time Period"
          >
            <MenuItem value="1d">1 Day</MenuItem>
            <MenuItem value="5d">5 Days</MenuItem>
            <MenuItem value="1m">1 Month</MenuItem>
            <MenuItem value="3m">3 Months</MenuItem>
            <MenuItem value="6m">6 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {stocks.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Your watchlist is empty. Add stocks to see their charts.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {stocks.map((symbol) => (
            <Grid item xs={12} md={6} key={symbol}>
              <StockChart symbol={symbol} initialPeriod={globalPeriod} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default WatchlistCharts; 