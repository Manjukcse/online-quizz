import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const InstructorDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [resources, setResources] = useState([]);
  
  // Modal & Form State
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    examId: '',
    resourceUrl: '',
    description: ''
  });

  // Notification Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchDashboardData = () => {
    api.get('/instructor/exams').then((res) => setExams(res.data.data || [])).catch(() => {});
    api.get('/instructor/results').then((res) => setResults(res.data.data || [])).catch(() => {});
    api.get('/instructor/resources').then((res) => setResources(res.data.data || [])).catch(() => {});
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenModal = () => {
    setNewResource({ title: '', examId: '', resourceUrl: '', description: '' });
    setOpenResourceModal(true);
  };

  const handleCloseModal = () => {
    setOpenResourceModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.resourceUrl) {
      setSnackbar({ open: true, message: 'Please provide both Title and Resource URL.', severity: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: newResource.title,
        resourceUrl: newResource.resourceUrl,
        description: newResource.description,
        examId: newResource.examId ? Number(newResource.examId) : null
      };

      await api.post('/instructor/resources', payload);
      setSnackbar({ open: true, message: 'Learning resource added successfully!', severity: 'success' });
      handleCloseModal();
      fetchDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add learning resource. Please check inputs.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/instructor/resources/${id}`);
      setSnackbar({ open: true, message: 'Learning resource deleted.', severity: 'info' });
      fetchDashboardData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete learning resource.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Instructor Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your examination courses, questions, schedules, learning resources, and review student attempt scorecards.
      </Typography>

      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">My Exams</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{exams.length}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: '#6366f1' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Student Submissions</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{results.length}</Typography>
              </Box>
              <AssessmentIcon sx={{ fontSize: 40, color: '#a855f7' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="glass-card">
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Learning Resources</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>{resources.length}</Typography>
              </Box>
              <MenuBookIcon sx={{ fontSize: 40, color: '#10b981' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} component={Link} to="/instructor/exams/create">
          Create New Exam
        </Button>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Learning Resource
        </Button>
        <Button variant="outlined" component={Link} to="/instructor/exams">
          Manage All Exams
        </Button>
        <Button variant="outlined" component={Link} to="/instructor/results">
          View Student Results & Provide Feedback
        </Button>
      </Box>

      {/* Learning Resources Management Section */}
      <Card className="glass-card" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBookIcon sx={{ color: '#10b981' }} />
            <Typography variant="h6" fontWeight="bold">
              Course & Study Resources
            </Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleOpenModal}>
            Add Resource
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {resources.length === 0 ? (
          <Alert severity="info" sx={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd' }}>
            No learning resources added yet. Click <strong>"Add Learning Resource"</strong> to share study materials and references for your students.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {resources.map((res) => (
              <Grid item xs={12} sm={6} md={4} key={res.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip label={res.examTitle || 'General'} size="small" color="primary" variant="outlined" />
                      <Tooltip title="Delete Resource">
                        <IconButton size="small" color="error" onClick={() => handleDeleteResource(res.id, res.title)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontSize: '1.1rem' }}>
                      {res.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 1 }}>
                      {res.description || 'No description provided.'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      endIcon={<LaunchIcon />}
                      href={res.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Link
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>

      {/* Add Learning Resource Modal Dialog */}
      <Dialog open={openResourceModal} onClose={handleCloseModal} maxWidth="sm" fullWidth paperProps={{ sx: { background: '#1e293b', color: '#fff' } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Learning Resource</DialogTitle>
        <Box component="form" onSubmit={handleAddResource}>
          <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <TextField
              margin="dense"
              name="title"
              label="Resource Title"
              placeholder="e.g. Java Fundamentals Cheatsheet"
              type="text"
              fullWidth
              required
              value={newResource.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="exam-select-label">Associated Exam (Optional)</InputLabel>
              <Select
                labelId="exam-select-label"
                name="examId"
                value={newResource.examId}
                label="Associated Exam (Optional)"
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>General (No specific exam)</em>
                </MenuItem>
                {exams.map((exam) => (
                  <MenuItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="resourceUrl"
              label="Resource URL"
              placeholder="https://example.com/docs or PDF URL"
              type="url"
              fullWidth
              required
              value={newResource.resourceUrl}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              name="description"
              label="Description (Optional)"
              placeholder="Brief description of the study material"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newResource.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Add Resource'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstructorDashboard;
