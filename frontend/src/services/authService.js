import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const register = (username, email, password, role) => {
  return api.post('/auth/register', { username, email, password, role });
};

export const verifyToken = (token) => {
  return api.post('/auth/verify', { token });
};

export default api;

