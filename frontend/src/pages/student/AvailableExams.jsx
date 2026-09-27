import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentExams, registerForExam } from '../../store/examSlice';
import StatusChip from '../../components/StatusChip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const AvailableExams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exams } = useSelector((state) => state.exam);

  const [snack, setSnack] = useState('');
  const [errorSnack, setErrorSnack] = useState('');

  useEffect(() => {
    dispatch(fetchStudentExams());
  }, [dispatch]);

  const handleRegister = (examId) => {
    dispatch(registerForExam(examId))
      .unwrap()
      .then(() => {
        setSnack('Registered for exam successfully!');
        dispatch(fetchStudentExams());
      })
      .catch((err) => {
        setErrorSnack(err || 'Registration failed');
      });
  };

  const handleStartExam = (exam) => {
    if (exam.timingStatus === 'NOT_STARTED') {
      alert('Exam has not started yet. Please wait until the scheduled start time.');
      return;
    }
    if (exam.timingStatus === 'EXPIRED') {
      alert('Exam time is over.');
      return;
    }
    navigate(`/student/exam/${exam.id}/attempt`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Available Examinations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Register for exams in advance. Exams can only be attempted during their scheduled time window.
      </Typography>

      <Snackbar open={Boolean(snack)} autoHideDuration={4000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
      <Snackbar open={Boolean(errorSnack)} autoHideDuration={4000} onClose={() => setErrorSnack('')}>
        <Alert severity="error">{errorSnack}</Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {exams.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No published exams available at the moment.</Alert>
          </Grid>
        ) : (
          exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {exam.title}
                    </Typography>
                    <StatusChip status={exam.timingStatus} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exam.description || 'No description provided.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Date:</strong> {exam.examDate}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Window:</strong> {exam.startTime} - {exam.endTime}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Duration:</strong> {exam.durationMinutes} Minutes
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Marks:</strong> {exam.totalMarks} (Pass: {exam.passingPercentage}%)
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {exam.isCompleted ? (
                    <Button variant="outlined" color="success" fullWidth disabled>
                      Completed
                    </Button>
                  ) : exam.isRegistered ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleStartExam(exam)}
                      disabled={exam.timingStatus !== 'IN_PROGRESS'}
                    >
                      {exam.timingStatus === 'NOT_STARTED'
                        ? 'Not Started Yet'
                        : exam.timingStatus === 'EXPIRED'
                        ? 'Exam Expired'
                        : 'Start Exam'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => handleRegister(exam.id)}
                    >
                      Register Now
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default AvailableExams;
