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

// Handle 401 errors (unauthorized) - but don't redirect immediately
// Let the AuthContext handle logout and navigation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect here - let React Router handle it through AuthContext
    // The AuthContext will handle logout and ProtectedRoute will redirect
    return Promise.reject(error);
  }
);

// Disciplinary Cases API
export const getCases = () => {
  return api.get('/disciplinary');
};

export const getCaseById = (id) => {
  return api.get(`/disciplinary/${id}`);
};

export const createCase = (caseData) => {
  return api.post('/disciplinary', caseData);
};

export const updateCase = (id, caseData) => {
  return api.put(`/disciplinary/${id}`, caseData);
};

export const deleteCase = (id) => {
  return api.delete(`/disciplinary/${id}`);
};

export const getCasesByEmployee = (employeeId) => {
  return api.get(`/disciplinary/employee/${employeeId}`);
};

export default api;

