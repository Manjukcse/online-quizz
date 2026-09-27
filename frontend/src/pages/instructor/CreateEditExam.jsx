import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, TextField, Button, Grid, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const CreateEditExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    totalMarks: 100,
    passingPercentage: 40,
    examDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '21:00',
    durationMinutes: 60,
    isPublished: true,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/instructor/exams/${id}`).then((res) => {
        const e = res.data.data;
        setFormData({
          title: e.title,
          description: e.description || '',
          code: e.code || '',
          totalMarks: e.totalMarks,
          passingPercentage: e.passingPercentage,
          examDate: e.examDate,
          startTime: e.startTime,
          endTime: e.endTime,
          durationMinutes: e.durationMinutes,
          isPublished: e.isPublished,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const apiCall = isEdit
      ? api.put(`/instructor/exams/${id}`, formData)
      : api.post('/instructor/exams', formData);

    apiCall
      .then(() => {
        setLoading(false);
        navigate('/instructor/exams');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data?.message || 'Failed to save exam.');
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card className="glass-card">
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
            {isEdit ? 'Edit Exam' : 'Create New Exam'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure exam title, timing window, duration, total marks, and passing criteria.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  label="Exam Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Exam Code (e.g. JAVA-101)"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description / Rules"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Exam Date"
                  name="examDate"
                  InputLabelProps={{ shrink: true }}
                  value={formData.examDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="time"
                  label="Start Time"
                  name="startTime"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="time"
                  label="End Time"
                  name="endTime"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Duration (Minutes)"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Total Marks"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Passing Percentage (%)"
                  name="passingPercentage"
                  value={formData.passingPercentage}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/instructor/exams')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Exam' : 'Create Exam'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateEditExam;
