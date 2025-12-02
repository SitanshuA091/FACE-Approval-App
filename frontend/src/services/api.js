import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enrollment APIs
export const enrollFromWebcam = async (name, imageBase64) => {
  const response = await api.post('/api/enroll/webcam', {
    name,
    image: imageBase64,
  });
  return response.data;
};

export const enrollFromFile = async (name, file) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('file', file);

  const response = await api.post('/api/enroll/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Approval API
export const approveEntry = async (imageBase64) => {
  const response = await api.post('/api/approve', {
    image: imageBase64,
  });
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const getAttendanceRecords = async () => {
  const response = await api.get('/api/dashboard/attendance');
  return response.data;
};

export const getEnrolledUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;