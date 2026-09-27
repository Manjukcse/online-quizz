import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingInstructors, approveInstructor } from '../../store/userSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ManageInstructors = () => {
  const dispatch = useDispatch();
  const { pendingInstructors } = useSelector((state) => state.user);

  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [salary, setSalary] = useState(50000);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPendingInstructors());
  }, [dispatch]);

  const handleOpenApprove = (instructor) => {
    setSelectedInstructor(instructor);
    setSalary(50000);
    setOpenModal(true);
  };

  const handleConfirmApprove = () => {
    if (selectedInstructor) {
      dispatch(approveInstructor({ id: selectedInstructor.id, approve: true, salary: parseInt(salary, 10) }));
      setOpenModal(false);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this instructor application?')) {
      dispatch(approveInstructor({ id, approve: false, salary: 0 }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom className="gradient-text">
        Pending Instructor Approvals
      </Typography>

      <TableContainer component={Paper} className="glass-card" sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingInstructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending instructor applications.
                </TableCell>
              </TableRow>
            ) : (
              pendingInstructors.map((inst) => (
                <TableRow key={inst.id}>
                  <TableCell>{inst.id}</TableCell>
                  <TableCell>{inst.fullName}</TableCell>
                  <TableCell>{inst.username}</TableCell>
                  <TableCell>{inst.email}</TableCell>
                  <TableCell>{inst.mobile || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleOpenApprove(inst)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => handleReject(inst.id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Salary Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Assign Salary & Approve Instructor</DialogTitle>
        <DialogContent sx={{ minWidth: 350, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Approving: <strong>{selectedInstructor?.fullName}</strong> ({selectedInstructor?.email})
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Monthly Salary (USD / INR)"
            type="number"
            fullWidth
            variant="outlined"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleConfirmApprove} variant="contained" color="success">
            Confirm & Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageInstructors;
