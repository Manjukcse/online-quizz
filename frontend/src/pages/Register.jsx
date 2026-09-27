import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    mobile: '',
    role: 'ROLE_STUDENT',
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        if (formData.role === 'ROLE_INSTRUCTOR') {
          setSuccessMsg('Instructor account registered! Please wait for system admin approval before logging in.');
        } else {
          setSuccessMsg('Account registered successfully! Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      })
      .catch(() => {});
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card className="glass-card">
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ m: 1, bgcolor: 'secondary.main', p: 1.5, borderRadius: '50%', display: 'flex' }}>
              <PersonAddOutlinedIcon />
            </Box>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Create an Account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Join as a Student or apply as an Instructor
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Register As</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Register As"
                onChange={handleChange}
              >
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                <MenuItem value="ROLE_INSTRUCTOR">Instructor (Requires Approval)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Mobile Number"
              name="mobile"
              autoComplete="tel"
              value={formData.mobile}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Address"
              name="address"
              autoComplete="street-address"
              value={formData.address}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
            >
              {loading ? 'Submitting...' : 'Register'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign In
              </MuiLink>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
