import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useTranslation } from 'react-i18next';
import './i18n';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskDetail from './pages/TaskDetail';
import Layout from './components/Layout';

// Get language from localStorage or default to Arabic
const savedLanguage = localStorage.getItem('language') || 'ar';
const isRtl = savedLanguage === 'ar';

const theme = createTheme({
  direction: isRtl ? 'rtl' : 'ltr',
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    orange: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: isRtl 
      ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
      : '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <div>{t('app.loading')}</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

// Create RTL and LTR caches
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});

function App() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || localStorage.getItem('language') || 'ar';
  const isRtl = currentLang === 'ar';

  // Select cache based on direction
  const emotionCache = React.useMemo(() => {
    return isRtl ? cacheRtl : cacheLtr;
  }, [isRtl]);

  // Update theme direction based on language
  const currentTheme = React.useMemo(() => createTheme({
    ...theme,
    direction: isRtl ? 'rtl' : 'ltr',
    typography: {
      fontFamily: isRtl 
        ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
        : '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  }), [isRtl]);

  // Set HTML direction and language attributes
  React.useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [isRtl, currentLang]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={currentTheme}>
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
    </CacheProvider>
  );
}

export default App;

