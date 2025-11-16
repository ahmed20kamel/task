import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Alert,
  Grid,
} from '@mui/material';
import { ArrowBack, Edit, Assessment } from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [evaluationDialog, setEvaluationDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [evaluationData, setEvaluationData] = useState({ rating: 3, feedback: '' });

  useEffect(() => {
    fetchTask();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}/`);
      setTask(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        priority: response.data.priority,
        due_date: response.data.due_date ? format(new Date(response.data.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        status: response.data.status,
      });
    } catch (error) {
      toast.error('حدث خطأ في تحميل المهمة');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${id}/`, formData);
      toast.success('تم تحديث المهمة بنجاح');
      setEditDialog(false);
      fetchTask();
    } catch (error) {
      toast.error('حدث خطأ في التحديث');
    }
  };

  const handleEvaluate = async () => {
    try {
      await api.post('/tasks/evaluations/', {
        task: id,
        rating: evaluationData.rating,
        feedback: evaluationData.feedback,
      });
      toast.success('تم تقييم المهمة بنجاح');
      setEvaluationDialog(false);
      fetchTask();
    } catch (error) {
      toast.error('حدث خطأ في التقييم');
    }
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

  if (!task) {
    return null;
  }

  const canEdit = user.is_admin || (user.is_employee && task.status !== 'completed');
  const canEvaluate = user.is_admin && task.status === 'completed' && !task.evaluation;

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        رجوع
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">{task.title}</Typography>
          {canEdit && (
            <Button startIcon={<Edit />} onClick={() => setEditDialog(true)}>
              تعديل
            </Button>
          )}
          {canEvaluate && (
            <Button
              startIcon={<Assessment />}
              variant="contained"
              onClick={() => setEvaluationDialog(true)}
            >
              تقييم
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  الوصف
                </Typography>
                <Typography variant="body1">{task.description}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  الحالة
                </Typography>
                <Chip label={getStatusLabel(task.status)} sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  الأولوية
                </Typography>
                <Chip label={getPriorityLabel(task.priority)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  تاريخ الإنشاء
                </Typography>
                <Typography variant="body1">
                  {format(new Date(task.created_at), 'yyyy-MM-dd HH:mm', { locale: ar })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  تاريخ الانتهاء
                </Typography>
                <Typography variant="body1">
                  {format(new Date(task.due_date), 'yyyy-MM-dd HH:mm', { locale: ar })}
                </Typography>
                {task.is_overdue && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    هذه المهمة متأخرة
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {task.assigned_to && (
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    المكلف
                  </Typography>
                  <Typography variant="body1">
                    {task.assigned_to.first_name} {task.assigned_to.last_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {task.evaluation && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    التقييم
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>التقييم:</strong> {task.evaluation.rating}/5
                  </Typography>
                  {task.evaluation.feedback && (
                    <Typography variant="body1">
                      <strong>ملاحظات:</strong> {task.evaluation.feedback}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    تاريخ التقييم: {format(new Date(task.evaluation.evaluated_at), 'yyyy-MM-dd HH:mm', { locale: ar })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>تعديل المهمة</DialogTitle>
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
          {user.is_admin && (
            <>
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
            </>
          )}
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
          <Button onClick={() => setEditDialog(false)}>إلغاء</Button>
          <Button onClick={handleUpdate} variant="contained">حفظ</Button>
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

export default TaskDetail;

