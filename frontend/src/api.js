import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://student-management-system-37zz.onrender.com/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('sms_accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('sms_refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('sms_accessToken', accessToken);
        localStorage.setItem('sms_refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('sms_accessToken');
        localStorage.removeItem('sms_refreshToken');
        localStorage.removeItem('sms_user');
        window.dispatchEvent(new Event('sms:logout'));
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const message = error.response.data?.message || 'Request failed';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Unable to connect to the API');
    } else {
      throw new Error('Request setup error');
    }
  }
);

// Helper functions for specific operations
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};


export const studentsAPI = {
  list: (params) => api.get('/students', { params }),
  get: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const coursesAPI = {
  list: (params) => api.get('/courses', { params }),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const attendanceAPI = {
  list: (params) => api.get('/attendance', { params }),
  get: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  studentHistory: (studentId) => api.get(`/attendance/student/${studentId}`),
  courseReport: (courseId) => api.get(`/attendance/course/${courseId}`),
};

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
  recent: () => api.get('/dashboard/recent'),
  charts: () => api.get('/dashboard/charts'),
};

export default api;
