import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      await fetchTasks();
      await fetchStatistics();
    };
    loadData();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/tasks/', { params });
      setTasks(response.data);
    } catch (error) {
      toast.error('حدث خطأ في تحميل المهام');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/tasks/statistics/');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/`, { status: newStatus });
      toast.success('تم تحديث حالة المهمة بنجاح');
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      toast.error('حدث خطأ في تحديث الحالة');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      urgent: 'error',
    };
    return colors[priority] || 'default';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      urgent: 'عاجل',
    };
    return labels[priority] || priority;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">لوحة تحكم الموظف</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>فلترة حسب الحالة</InputLabel>
          <Select
            value={statusFilter}
            label="فلترة حسب الحالة"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">الكل</MenuItem>
            <MenuItem value="pending">قيد الانتظار</MenuItem>
            <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
            <MenuItem value="completed">مكتمل</MenuItem>
            <MenuItem value="cancelled">ملغي</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                إجمالي المهام
              </Typography>
              <Typography variant="h4">{statistics.total_tasks || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                قيد الانتظار
              </Typography>
              <Typography variant="h4" color="warning.main">
                {statistics.pending_tasks || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                قيد التنفيذ
              </Typography>
              <Typography variant="h4" color="primary.main">
                {statistics.in_progress_tasks || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                مكتملة
              </Typography>
              <Typography variant="h4" color="success.main">
                {statistics.completed_tasks || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العنوان</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الأولوية</TableCell>
              <TableCell>تاريخ الانتهاء</TableCell>
              <TableCell>التقييم</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} sx={{ bgcolor: isOverdue(task.due_date) && task.status !== 'completed' ? 'error.light' : 'inherit' }}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    size="small"
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="pending">قيد الانتظار</MenuItem>
                    <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                    <MenuItem value="completed">مكتمل</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPriorityLabel(task.priority)}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    {task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd HH:mm', { locale: ar }) : '-'}
                    {isOverdue(task.due_date) && task.status !== 'completed' && (
                      <Chip label="متأخرة" color="error" size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {task.evaluation ? (
                    <Box>
                      <Chip label={`${task.evaluation.rating}/5`} color="primary" size="small" />
                      {task.evaluation.feedback && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          {task.evaluation.feedback}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      لا يوجد تقييم
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/dashboard/tasks/${task.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  {task.status === 'pending' && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ToastContainer position="top-left" rtl={true} />
    </Container>
  );
};

export default EmployeeDashboard;

