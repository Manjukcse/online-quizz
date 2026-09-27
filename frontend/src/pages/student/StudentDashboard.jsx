import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get('/student/exams').then((res) => setExams(res.data.data));
    api.get('/student/results').then((res) => setResults(res.data.data));
  }, []);

  const registeredExams = exams.filter((e) => e.isRegistered);
  const completedResults = results;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Student Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome! Register for available exams, start scheduled tests, view detailed scorecards and instructor feedback.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Available Exams</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{exams.length}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Registered Exams</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{registeredExams.length}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: '#10b981' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Completed Attempts</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{completedResults.length}</Typography>
              </Box>
              <AssessmentIcon sx={{ fontSize: 40, color: '#a855f7' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" component={Link} to="/student/exams">
          Browse & Register Exams
        </Button>
        <Button variant="outlined" component={Link} to="/student/results">
          View Scorecards & Feedback
        </Button>
        <Button variant="outlined" component={Link} to="/student/resources" startIcon={<LibraryBooksIcon />}>
          Study Resources
        </Button>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
