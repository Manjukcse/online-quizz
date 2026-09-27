import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AdminDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports')
      .then((res) => {
        setReport(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { title: 'Total Students', value: report?.totalStudents || 0, icon: <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6' }} /> },
    { title: 'Approved Instructors', value: report?.totalApprovedInstructors || 0, icon: <SchoolIcon sx={{ fontSize: 40, color: '#10b981' }} /> },
    { title: 'Pending Instructors', value: report?.totalPendingInstructors || 0, icon: <HowToRegIcon sx={{ fontSize: 40, color: '#f59e0b' }} /> },
    { title: 'Total Exams', value: report?.totalExams || 0, icon: <AssignmentIcon sx={{ fontSize: 40, color: '#8b5cf6' }} /> },
    { title: 'Total Questions', value: report?.totalQuestions || 0, icon: <QuizIcon sx={{ fontSize: 40, color: '#ec4899' }} /> },
    { title: 'Overall Pass Rate', value: `${report?.overallPassRatePercentage || 0}%`, icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#06b6d4' }} /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of system users, instructor approvals, exams, and platform analytics.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card className="glass-card">
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {stat.value}
                  </Typography>
                </Box>
                {stat.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" component={Link} to="/admin/instructors/pending" color="warning">
          Review Pending Instructors ({report?.totalPendingInstructors || 0})
        </Button>
        <Button variant="outlined" component={Link} to="/admin/users">
          Manage All Users
        </Button>
        <Button variant="outlined" component={Link} to="/admin/reports">
          View Detailed Reports
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
