import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Avatar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import QuizIcon from '@mui/icons-material/Quiz';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (!user || !user.roles) return '';
    if (user.roles.includes('ROLE_ADMIN')) return 'ADMIN';
    if (user.roles.includes('ROLE_INSTRUCTOR')) return 'INSTRUCTOR';
    if (user.roles.includes('ROLE_STUDENT')) return 'STUDENT';
    return '';
  };

  return (
    <AppBar position="sticky" sx={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Toolbar>
        <QuizIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#6366f1' }} />
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            display: 'flex',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: 1,
          }}
        >
          ExamPortal <span style={{ color: '#a855f7', marginLeft: 4 }}>Pro</span>
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={getRoleLabel()}
              size="small"
              color={getRoleLabel() === 'ADMIN' ? 'error' : getRoleLabel() === 'INSTRUCTOR' ? 'secondary' : 'primary'}
            />
            <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.fullName || user.username}
            </Typography>
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" color="primary" component={Link} to="/register">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
