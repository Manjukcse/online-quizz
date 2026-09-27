import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Unauthorized = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Box className="glass-card" sx={{ p: 5 }}>
        <SecurityIcon sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Access Denied (403)
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          You do not have permission to view this page. Please contact an administrator or sign in with an authorized account.
        </Typography>
        <Button variant="contained" component={Link} to="/login">
          Return to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
