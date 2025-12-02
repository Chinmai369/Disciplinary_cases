import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Disciplinary Cases
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Disciplinary Cases Management. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

