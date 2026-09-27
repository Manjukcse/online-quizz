import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorExams } from '../../store/examSlice';
import api from '../../api/axios';
import StatusChip from '../../components/StatusChip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';

const ManageExams = () => {
  const dispatch = useDispatch();
  const { exams } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(fetchInstructorExams());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam? All questions and results will be removed.')) {
      api.delete(`/instructor/exams/${id}`).then(() => {
        dispatch(fetchInstructorExams());
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" className="gradient-text">
          Exam & Course Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} component={Link} to="/instructor/exams/create">
          Create Exam
        </Button>
      </Box>

      <TableContainer component={Paper} className="glass-card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Window (Start - End)</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Passing %</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Timing Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">No exams created yet.</TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell fontWeight="bold">{exam.title}</TableCell>
                  <TableCell>{exam.code}</TableCell>
                  <TableCell>{exam.examDate}</TableCell>
                  <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                  <TableCell>{exam.durationMinutes} mins</TableCell>
                  <TableCell>{exam.passingPercentage}%</TableCell>
                  <TableCell>{exam.totalQuestions}</TableCell>
                  <TableCell><StatusChip status={exam.timingStatus} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Manage Questions">
                      <IconButton color="secondary" component={Link} to={`/instructor/exams/${exam.id}/questions`}>
                        <QuizIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Exam">
                      <IconButton color="info" component={Link} to={`/instructor/exams/${exam.id}/edit`}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Exam">
                      <IconButton color="error" onClick={() => handleDelete(exam.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageExams;
