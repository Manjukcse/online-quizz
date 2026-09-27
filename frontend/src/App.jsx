import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

// Layout & Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageInstructors from './pages/admin/ManageInstructors';
import AdminReports from './pages/admin/AdminReports';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ManageExams from './pages/instructor/ManageExams';
import CreateEditExam from './pages/instructor/CreateEditExam';
import ManageQuestions from './pages/instructor/ManageQuestions';
import InstructorResults from './pages/instructor/InstructorResults';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExams from './pages/student/AvailableExams';
import TakeExam from './pages/student/TakeExam';
import ExamResultView from './pages/student/ExamResultView';
import StudentProfile from './pages/student/StudentProfile';
import LearningResourcesView from './pages/student/LearningResourcesView';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {user && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#0f172a' }}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/instructors/pending" element={<ManageInstructors />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/exams" element={<ManageExams />} />
        </Route>

        {/* INSTRUCTOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']} />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/exams" element={<ManageExams />} />
          <Route path="/instructor/exams/create" element={<CreateEditExam />} />
          <Route path="/instructor/exams/:id/edit" element={<CreateEditExam />} />
          <Route path="/instructor/exams/:examId/questions" element={<ManageQuestions />} />
          <Route path="/instructor/results" element={<InstructorResults />} />
        </Route>

        {/* STUDENT & SHARED RESOURCES ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_INSTRUCTOR', 'ROLE_ADMIN']} />}>
          <Route path="/student/resources" element={<LearningResourcesView />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exams" element={<AvailableExams />} />
          <Route path="/student/exam/:id/attempt" element={<TakeExam />} />
          <Route path="/student/results" element={<ExamResultView />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
