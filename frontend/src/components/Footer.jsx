import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Enterprise Online Examination System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
