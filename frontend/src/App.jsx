import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskDetail from './pages/TaskDetail';
import Layout from './components/Layout';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
});

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Register />} />
          
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requireAdmin={true}>
                <Layout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="tasks/:id" element={<TaskDetail />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route index element={<EmployeeDashboard />} />
                    <Route path="tasks/:id" element={<TaskDetail />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

