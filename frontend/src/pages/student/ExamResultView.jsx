import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentResults } from '../../store/resultSlice';
import StatusChip from '../../components/StatusChip';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ExamResultView = () => {
  const dispatch = useDispatch();
  const { results } = useSelector((state) => state.result);

  const [selectedResult, setSelectedResult] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentResults());
  }, [dispatch]);

  const handleOpenDetails = (result) => {
    setSelectedResult(result);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        My Exam Scorecards & Results
      </Typography>

      <TableContainer component={Paper} className="glass-card" sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Result ID</TableCell>
              <TableCell>Exam Title</TableCell>
              <TableCell>Obtained / Total Marks</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Passing Criteria</TableCell>
              <TableCell>Pass / Fail</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell align="right">Detailed Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No completed exam attempts found.
                </TableCell>
              </TableRow>
            ) : (
              results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell fontWeight="bold">{r.examTitle}</TableCell>
                  <TableCell>{r.obtainedMarks} / {r.totalMarks}</TableCell>
                  <TableCell>{r.percentage}%</TableCell>
                  <TableCell>{r.passingPercentage}% required</TableCell>
                  <TableCell><StatusChip status={r.passStatus} /></TableCell>
                  <TableCell>{new Date(r.submittedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenDetails(r)}
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Result Report Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Exam Scorecard Report: {selectedResult?.examTitle}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Score</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedResult?.obtainedMarks} / {selectedResult?.totalMarks}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Percentage</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedResult?.percentage}%</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Pass Status</Typography>
              <StatusChip status={selectedResult?.passStatus} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Attempted</Typography>
              <Typography variant="h6">{selectedResult?.attemptedQuestions} / {selectedResult?.totalQuestions} Qs</Typography>
            </Grid>
          </Grid>

          {selectedResult?.feedbacks && selectedResult.feedbacks.length > 0 && (
            <Card className="glass-card" sx={{ mb: 3, p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Instructor Feedback:
              </Typography>
              {selectedResult.feedbacks.map((f) => (
                <Box key={f.id} sx={{ mt: 1 }}>
                  <Rating value={f.rating} readOnly size="small" />
                  <Typography variant="body2">"{f.comment}" — <em>{f.instructorName}</em></Typography>
                </Box>
              ))}
            </Card>
          )}

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Question Breakdown
          </Typography>

          {selectedResult?.answers && selectedResult.answers.map((a, idx) => (
            <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2, borderColor: a.isCorrect ? 'success.main' : 'error.main' }}>
              <Typography variant="body1" fontWeight="bold">
                Q{idx + 1}. {a.questionText} ({a.marksObtained}/{a.questionMarks} Marks)
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: a.isCorrect ? 'success.main' : 'error.main' }}>
                Your Answer: {a.selectedOptionText}
              </Typography>
              {!a.isCorrect && (
                <Typography variant="body2" color="success.main">
                  Correct Answer: {a.correctOptionText}
                </Typography>
              )}
              {a.explanation && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Explanation: {a.explanation}
                </Typography>
              )}
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamResultView;
