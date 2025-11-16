import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [evaluationDialog, setEvaluationDialog] = useState(false);
  const [taskToEvaluate, setTaskToEvaluate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
  });
  const [evaluationData, setEvaluationData] = useState({
    rating: 3,
    feedback: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchStatistics();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      toast.error('حدث خطأ في تحميل المهام');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/auth/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
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

  const handleOpenDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to?.id || '',
        priority: task.priority,
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        status: task.status,
      });
    } else {
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
        status: 'pending',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        assigned_to: formData.assigned_to || null,
      };
      
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}/`, submitData);
        toast.success('تم تحديث المهمة بنجاح');
      } else {
        await api.post('/tasks/', submitData);
        toast.success('تم إنشاء المهمة بنجاح');
      }
      handleCloseDialog();
      fetchTasks();
      fetchStatistics();
    } catch (error) {
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object' && !errorMsg.error) {
        const firstError = Object.values(errorMsg)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError || 'حدث خطأ');
      } else {
        toast.error(errorMsg?.error || 'حدث خطأ');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      try {
        await api.delete(`/tasks/${id}/`);
        toast.success('تم حذف المهمة بنجاح');
        fetchTasks();
        fetchStatistics();
      } catch (error) {
        toast.error('حدث خطأ في حذف المهمة');
      }
    }
  };

  const handleOpenEvaluation = (task) => {
    setTaskToEvaluate(task);
    setEvaluationData({ rating: 3, feedback: '' });
    setEvaluationDialog(true);
  };

  const handleEvaluate = async () => {
    try {
      await api.post('/tasks/evaluations/', {
        task: taskToEvaluate.id,
        rating: evaluationData.rating,
        feedback: evaluationData.feedback,
      });
      toast.success('تم تقييم المهمة بنجاح');
      setEvaluationDialog(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'حدث خطأ في التقييم');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'قيد الانتظار',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };
    return labels[status] || status;
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
        <Typography variant="h4">لوحة تحكم المدير</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          مهمة جديدة
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                إجمالي المهام
              </Typography>
              <Typography variant="h4">{statistics.total_tasks || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
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
        <Grid item xs={12} sm={6} md={2.4}>
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
        <Grid item xs={12} sm={6} md={2.4}>
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
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                متأخرة
              </Typography>
              <Typography variant="h4" color="error.main">
                {statistics.overdue_tasks || 0}
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
              <TableCell>المكلف</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الأولوية</TableCell>
              <TableCell>تاريخ الانتهاء</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  {task.assigned_to ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(task.status)}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPriorityLabel(task.priority)}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd HH:mm', { locale: ar }) : '-'}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/admin/tasks/${task.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(task)}>
                    <EditIcon />
                  </IconButton>
                  {task.status === 'completed' && !task.evaluation && (
                    <IconButton size="small" onClick={() => handleOpenEvaluation(task)} color="primary">
                      <AssessmentIcon />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => handleDelete(task.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTask ? 'تعديل المهمة' : 'مهمة جديدة'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="العنوان"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="الوصف"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            select
            label="تعيين إلى"
            value={formData.assigned_to || ''}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value || null })}
            margin="normal"
          >
            <MenuItem value="">لا يوجد</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} ({emp.username})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="الحالة"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            margin="normal"
          >
            <MenuItem value="pending">قيد الانتظار</MenuItem>
            <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
            <MenuItem value="completed">مكتمل</MenuItem>
            <MenuItem value="cancelled">ملغي</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="الأولوية"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            margin="normal"
          >
            <MenuItem value="low">منخفض</MenuItem>
            <MenuItem value="medium">متوسط</MenuItem>
            <MenuItem value="high">عالي</MenuItem>
            <MenuItem value="urgent">عاجل</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="تاريخ الانتهاء"
            type="datetime-local"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">حفظ</Button>
        </DialogActions>
      </Dialog>

      {/* Evaluation Dialog */}
      <Dialog open={evaluationDialog} onClose={() => setEvaluationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>تقييم المهمة</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="التقييم"
            value={evaluationData.rating}
            onChange={(e) => setEvaluationData({ ...evaluationData, rating: parseInt(e.target.value) })}
            margin="normal"
          >
            <MenuItem value={1}>ضعيف جداً</MenuItem>
            <MenuItem value={2}>ضعيف</MenuItem>
            <MenuItem value={3}>متوسط</MenuItem>
            <MenuItem value={4}>جيد</MenuItem>
            <MenuItem value={5}>ممتاز</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="ملاحظات"
            value={evaluationData.feedback}
            onChange={(e) => setEvaluationData({ ...evaluationData, feedback: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEvaluationDialog(false)}>إلغاء</Button>
          <Button onClick={handleEvaluate} variant="contained">حفظ التقييم</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-left" rtl={true} />
    </Container>
  );
};

export default AdminDashboard;

