import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Menu from './Menu';
import ExitConfirmationModal from './ExitConfirmationModal';
import useBackButtonBlocker from '../hooks/useBackButtonBlocker';

const Layout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  
  // Handle back button blocking with confirmation
  const { showConfirm, handleConfirm, handleCancel } = useBackButtonBlocker(isAuthenticated, logout);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
        <Menu />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-48">
        {/* Header Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 relative">
              {/* Centered Heading and Username */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="text-center">
                  <Link to="/" className="block">
                    <h1 className="text-xl font-bold text-primary-600">
                      Disciplinary Cases Management
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {user?.username || 'User'}
                    </p>
                  </Link>
                </div>
              </div>
              {/* User Menu - Desktop */}
              <div className="hidden md:flex md:items-center md:space-x-4 ml-auto">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Mobile User Menu */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs">
            <Menu />
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Layout;

