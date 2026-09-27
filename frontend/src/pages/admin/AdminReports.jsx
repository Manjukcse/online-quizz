import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../../api/axios';
import StatusChip from '../../components/StatusChip';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get('/admin/reports').then((res) => setReport(res.data.data));
    api.get('/admin/results').then((res) => setResults(res.data.data));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        System Analytics & Reports
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Exam Attempts</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{report?.totalExamAttempts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="body2" color="text.secondary">Passed Attempts</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main" sx={{ mt: 1 }}>{report?.totalPassedAttempts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="body2" color="text.secondary">Failed Attempts</Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main" sx={{ mt: 1 }}>{report?.totalFailedAttempts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="body2" color="text.secondary">Overall Pass Percentage</Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main" sx={{ mt: 1 }}>{report?.overallPassRatePercentage || 0}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Recent Student Exam Submissions
      </Typography>

      <TableContainer component={Paper} className="glass-card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Result ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Exam Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No exam submissions recorded yet.</TableCell>
              </TableRow>
            ) : (
              results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell>{r.studentName}</TableCell>
                  <TableCell>{r.examTitle}</TableCell>
                  <TableCell>{r.obtainedMarks} / {r.totalMarks}</TableCell>
                  <TableCell>{r.percentage}%</TableCell>
                  <TableCell><StatusChip status={r.passStatus} /></TableCell>
                  <TableCell>{new Date(r.submittedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminReports;
