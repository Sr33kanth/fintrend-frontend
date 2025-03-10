// src/components/Layout/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar disableGutters>
          <ShowChartIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Finance Trend App
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;