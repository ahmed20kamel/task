import axios from 'axios';

const api = axios.create({
  baseURL: 'https://task-x00b.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export default api;
