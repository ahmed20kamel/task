import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { Notifications, Logout, Dashboard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import api from '../services/api';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications/unread-count/');
        setUnreadCount(response.data.unread_count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            تطبيق إدارة المهام
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.first_name} {user?.last_name} ({user?.role === 'admin' ? 'مدير' : 'موظف'})
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setNotificationOpen(!notificationOpen)}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            تسجيل الخروج
          </Button>
        </Toolbar>
      </AppBar>
      
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

