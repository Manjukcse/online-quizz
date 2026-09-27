import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Link as MuiLink, Alert } from '@mui/material';
import api from '../../api/axios';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LaunchIcon from '@mui/icons-material/Launch';

const LearningResourcesView = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    api.get('/student/resources').then((res) => setResources(res.data.data));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Course & Study Resources
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Access study guides, documentation, and references recommended for your exams.
      </Typography>

      <Grid container spacing={3}>
        {resources.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No learning resources available yet.</Alert>
          </Grid>
        ) : (
          resources.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <MenuBookIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {r.title}
                  </Typography>
                  <Typography variant="caption" color="secondary" sx={{ display: 'block', mb: 1 }}>
                    Exam: {r.examTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.description || 'Recommended reading material.'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<LaunchIcon />}
                    component={MuiLink}
                    href={r.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Resource
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default LearningResourcesView;
