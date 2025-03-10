// src/components/Watchlist/WatchlistCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Divider, Typography, TextField, Button, Box, List, ListItem, Chip, IconButton } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface WatchlistCardProps {
  stocks: string[];
  onAddStock: (symbol: string) => Promise<void>;
  onRemoveStock: (symbol: string) => Promise<void>;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ stocks, onAddStock, onRemoveStock }) => {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    
    try {
      await onAddStock(symbol.trim().toUpperCase());
      setSymbol('');
      setError('');
    } catch (err: any) {
      setError(err.detail || 'Failed to add stock');
    }
  };

  return (
    <Card elevation={2}>
      <CardHeader
        avatar={<ListAltIcon color="primary" />}
        title="Watchlist"
        subheader={`${stocks.length} stocks tracked`}
      />
      <Divider />
      <CardContent>
        {/* Add Stock Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Stock Symbol"
              size="small"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. AAPL"
              fullWidth
            />
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/* Stock List */}
        {stocks.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            Your watchlist is empty. Add your first stock above.
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {stocks.map((stock) => (
              <ListItem 
                key={stock}
                secondaryAction={
                  <IconButton edge="end" onClick={() => onRemoveStock(stock)}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{ px: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}
              >
                <Chip label={stock} color="primary" variant="filled" />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistCard;