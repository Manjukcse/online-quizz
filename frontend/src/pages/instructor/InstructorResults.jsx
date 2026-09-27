import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Alert } from '@mui/material';
import api from '../../api/axios';
import StatusChip from '../../components/StatusChip';
import RateReviewIcon from '@mui/icons-material/RateReview';

const InstructorResults = () => {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [msg, setMsg] = useState('');

  const loadResults = () => {
    api.get('/instructor/results').then((res) => setResults(res.data.data));
  };

  useEffect(() => {
    loadResults();
  }, []);

  const handleOpenFeedback = (result) => {
    setSelectedResult(result);
    setComment('');
    setRating(5);
    setOpenModal(true);
  };

  const handleSendFeedback = () => {
    if (selectedResult) {
      api.post('/instructor/feedback', {
        resultId: selectedResult.id,
        comment,
        rating,
      }).then(() => {
        setOpenModal(false);
        setMsg('Feedback sent to student successfully!');
        loadResults();
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Student Exam Results & Feedback
      </Typography>

      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

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
              <TableCell>Feedback Given</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No student exam attempts recorded yet.</TableCell>
              </TableRow>
            ) : (
              results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell fontWeight="bold">{r.studentName}</TableCell>
                  <TableCell>{r.examTitle}</TableCell>
                  <TableCell>{r.obtainedMarks} / {r.totalMarks}</TableCell>
                  <TableCell>{r.percentage}%</TableCell>
                  <TableCell><StatusChip status={r.passStatus} /></TableCell>
                  <TableCell>
                    {r.feedbacks && r.feedbacks.length > 0 ? (
                      <Typography variant="body2" color="success.main">
                        ✓ {r.feedbacks.length} Comment(s)
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">None</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RateReviewIcon />}
                      onClick={() => handleOpenFeedback(r)}
                    >
                      Feedback
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Feedback Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Provide Instructor Feedback</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Feedback for: <strong>{selectedResult?.studentName}</strong> on <strong>{selectedResult?.examTitle}</strong> ({selectedResult?.obtainedMarks}/{selectedResult?.totalMarks} marks)
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </Box>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Feedback Comment / Suggestions"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSendFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorResults;
