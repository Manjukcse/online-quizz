import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Button, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Paper, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startExamAttempt, submitExamAttempt } from '../../store/examSlice';
import Timer from '../../components/Timer';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentExamAttempt, loading, error } = useSelector((state) => state.exam);

  const [answers, setAnswers] = useState({}); // questionId -> selectedOptionId

  useEffect(() => {
    dispatch(startExamAttempt(id));
  }, [id, dispatch]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your exam now?')) {
      const answersPayload = Object.keys(answers).map((qId) => ({
        questionId: parseInt(qId, 10),
        selectedOptionId: answers[qId],
      }));

      dispatch(submitExamAttempt({ examId: parseInt(id, 10), answers: answersPayload }))
        .unwrap()
        .then(() => {
          navigate('/student/results');
        })
        .catch(() => {});
    }
  };

  const handleAutoSubmit = () => {
    alert('Time limit reached! Auto-submitting your exam...');
    const answersPayload = Object.keys(answers).map((qId) => ({
      questionId: parseInt(qId, 10),
      selectedOptionId: answers[qId],
    }));

    dispatch(submitExamAttempt({ examId: parseInt(id, 10), answers: answersPayload }))
      .unwrap()
      .then(() => {
        navigate('/student/results');
      });
  };

  if (loading || !currentExamAttempt) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : (
          <Typography variant="h6">Loading Exam Environment...</Typography>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header bar with Timer */}
      <Paper className="glass-card" sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {currentExamAttempt.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Questions: {currentExamAttempt.questions.length} | Total Marks: {currentExamAttempt.totalMarks}
          </Typography>
        </Box>
        <Timer initialMinutes={currentExamAttempt.durationMinutes} onTimeUp={handleAutoSubmit} />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Questions list */}
      {currentExamAttempt.questions.map((q, idx) => (
        <Card key={q.id} className="glass-card" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Q{idx + 1}. {q.questionText} ({q.marks} Marks)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[q.id] || ''}
                onChange={(e) => handleOptionSelect(q.id, parseInt(e.target.value, 10))}
              >
                {q.options.map((opt) => (
                  <Paper
                    key={opt.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      borderColor: answers[q.id] === opt.id ? '#6366f1' : 'rgba(255,255,255,0.1)',
                      bgcolor: answers[q.id] === opt.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    }}
                  >
                    <FormControlLabel
                      value={opt.id}
                      control={<Radio color="primary" />}
                      label={opt.optionText}
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" color="success" size="large" onClick={handleSubmit} sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}>
          Submit Exam
        </Button>
      </Box>
    </Container>
  );
};

export default TakeExam;
