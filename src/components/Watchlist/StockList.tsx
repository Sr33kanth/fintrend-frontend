// src/components/Watchlist/StockList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Chip, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface StockListProps {
  stocks: string[];
  onRemoveStock: (symbol: string) => Promise<void>;
}

const StockList: React.FC<StockListProps> = ({ stocks, onRemoveStock }) => {
  if (stocks.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Your watchlist is empty. Add your first stock above.
        </Typography>
      </Box>
    );
  }

  return (
    <List dense sx={{ width: '100%' }}>
      {stocks.map((symbol) => (
        <ListItem
          key={symbol}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoveStock(symbol)}>
              <DeleteIcon />
            </IconButton>
          }
          sx={{ 
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            '&:last-child': { borderBottom: 'none' }
          }}
        >
          <ListItemText 
            primary={
              <Chip
                label={symbol}
                color="primary"
                size="small"
                variant="filled"
                sx={{ mr: 1, fontWeight: 'bold' }}
              />
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default StockList;