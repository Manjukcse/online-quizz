import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!user || !user.roles) return null;

  const isAdmin = user.roles.includes('ROLE_ADMIN');
  const isInstructor = user.roles.includes('ROLE_INSTRUCTOR');
  const isStudent = user.roles.includes('ROLE_STUDENT');

  const adminNavs = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
    { label: 'Pending Instructors', path: '/admin/instructors/pending', icon: <HowToRegIcon /> },
    { label: 'All Exams', path: '/admin/exams', icon: <AssignmentIcon /> },
    { label: 'Reports', path: '/admin/reports', icon: <AssessmentIcon /> },
  ];

  const instructorNavs = [
    { label: 'Dashboard', path: '/instructor/dashboard', icon: <DashboardIcon /> },
    { label: 'My Exams', path: '/instructor/exams', icon: <AssignmentIcon /> },
    { label: 'Student Results', path: '/instructor/results', icon: <AssessmentIcon /> },
    { label: 'Resources', path: '/student/resources', icon: <LibraryBooksIcon /> },
  ];

  const studentNavs = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <DashboardIcon /> },
    { label: 'Available Exams', path: '/student/exams', icon: <AssignmentIcon /> },
    { label: 'My Results', path: '/student/results', icon: <AssessmentIcon /> },
    { label: 'Resources', path: '/student/resources', icon: <LibraryBooksIcon /> },
    { label: 'Profile', path: '/student/profile', icon: <PersonIcon /> },
  ];

  let navItems = [];
  if (isAdmin) navItems = adminNavs;
  else if (isInstructor) navItems = instructorNavs;
  else if (isStudent) navItems = studentNavs;

  return (
    <Paper sx={{ width: 240, minHeight: 'calc(100vh - 64px)', background: '#1e293b', borderRadius: 0, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ p: 2 }}>
        <List>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#6366f1',
                      '&:hover': { backgroundColor: '#4f46e5' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#ffffff' : '#94a3b8' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default Sidebar;
