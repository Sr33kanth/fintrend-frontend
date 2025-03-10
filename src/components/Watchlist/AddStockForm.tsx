// src/components/Watchlist/AddStockForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddStockFormProps {
  onAddStock: (symbol: string) => Promise<void>;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ onAddStock }) => {
  const [symbol, setSymbol] = useState<string>('');
  const [error, setError] = useState<string>('');

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Stock Symbol"
          variant="outlined"
          size="small"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. AAPL"
          sx={{ mr: 1, flexGrow: 1 }}
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
  );
};

export default AddStockForm;