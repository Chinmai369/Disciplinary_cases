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
      navigate('/', { replace: true });
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
            <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
              <img
                src="/cdma_logo2.png"
                alt="Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
            <p className="text-base font-semibold text-blue-700 mb-3 whitespace-nowrap">
              Commissioner & Director of Municipal Administration
            </p>
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

