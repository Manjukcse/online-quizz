import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Radio, FormControlLabel, RadioGroup, IconButton, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageQuestions = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');

  const [qData, setQData] = useState({
    questionText: '',
    marks: 10,
    explanation: '',
    options: [
      { optionText: '', isCorrect: true },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
    ],
  });

  const loadQuestions = () => {
    api.get(`/instructor/exams/${examId}/questions`).then((res) => setQuestions(res.data.data));
    api.get(`/instructor/exams/${examId}`).then((res) => setExam(res.data.data));
  };

  useEffect(() => {
    loadQuestions();
  }, [examId]);

  const handleOptionChange = (idx, text) => {
    const updated = [...qData.options];
    updated[idx].optionText = text;
    setQData({ ...qData, options: updated });
  };

  const handleCorrectSelect = (idx) => {
    const updated = qData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx,
    }));
    setQData({ ...qData, options: updated });
  };

  const handleSaveQuestion = () => {
    setError('');
    api.post(`/instructor/exams/${examId}/questions`, qData)
      .then(() => {
        setOpenModal(false);
        setQData({
          questionText: '',
          marks: 10,
          explanation: '',
          options: [
            { optionText: '', isCorrect: true },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
          ],
        });
        loadQuestions();
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to add question');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this question?')) {
      api.delete(`/instructor/questions/${id}`).then(() => loadQuestions());
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" className="gradient-text">
            Questions for: {exam?.title || 'Exam'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage multiple choice questions and correct answer options.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Add Question
        </Button>
      </Box>

      <TableContainer component={Paper} className="glass-card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Question Text</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Options & Answer</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No questions added yet.</TableCell>
              </TableRow>
            ) : (
              questions.map((q, idx) => (
                <TableRow key={q.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell fontWeight="bold">{q.questionText}</TableCell>
                  <TableCell>{q.marks}</TableCell>
                  <TableCell>
                    {q.options.map((opt) => (
                      <Box key={opt.id} sx={{ color: opt.isCorrect ? '#10b981' : '#94a3b8', fontWeight: opt.isCorrect ? 'bold' : 'normal' }}>
                        {opt.isCorrect ? '✓ ' : '• '}{opt.optionText}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDelete(q.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Question Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            required
            label="Question Text"
            multiline
            rows={2}
            value={qData.questionText}
            onChange={(e) => setQData({ ...qData, questionText: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="number"
            label="Marks"
            value={qData.marks}
            onChange={(e) => setQData({ ...qData, marks: parseInt(e.target.value, 10) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Explanation (Optional)"
            value={qData.explanation}
            onChange={(e) => setQData({ ...qData, explanation: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
            Options (Select radio button for correct answer)
          </Typography>
          <RadioGroup value={qData.options.findIndex((o) => o.isCorrect)}>
            {qData.options.map((opt, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <FormControlLabel
                  value={i}
                  control={<Radio onChange={() => handleCorrectSelect(i)} />}
                  label={`Option ${i + 1}`}
                />
                <TextField
                  fullWidth
                  size="small"
                  required
                  placeholder={`Option ${i + 1} text`}
                  value={opt.optionText}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                />
              </Box>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            Save Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageQuestions;
