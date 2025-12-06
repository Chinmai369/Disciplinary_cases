import React, { createContext, useState, useEffect } from 'react';
import { login as loginAPI, verifyToken as verifyTokenAPI } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        // Verify token with backend asynchronously - only logout on actual 401, not network errors
        verifyTokenAPI(token).catch((error) => {
          // Only logout if it's a 401 (unauthorized) error, not network errors
          if (error.response?.status === 401) {
            logout();
          }
          // For other errors (network issues, etc.), keep user logged in
        });
      } catch (error) {
        logout();
        setLoading(false);
      }
    } else {
      // No token found, user is not authenticated
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginAPI(username, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

