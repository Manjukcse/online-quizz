import React from 'react';
import { Box, Typography, Container, Card, CardContent, Avatar, Grid, Divider } from '@mui/material';
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card className="glass-card">
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2, fontSize: '2rem' }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {user?.fullName || user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Role: {user?.roles?.join(', ')}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ textAlign: 'left' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Username</Typography>
              <Typography variant="body1">{user?.username}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography variant="body1" color="success.main" fontWeight="bold">{user?.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Mobile</Typography>
              <Typography variant="body1">{user?.mobile || 'Not set'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;
