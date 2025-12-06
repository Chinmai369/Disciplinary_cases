import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Menu from './Menu';
import ExitConfirmationModal from './ExitConfirmationModal';
import useBackButtonBlocker from '../hooks/useBackButtonBlocker';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  
  // Handle back button blocking with confirmation
  const { showConfirm, handleConfirm, handleCancel } = useBackButtonBlocker(isAuthenticated, logout);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
        <Menu />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-56">
        {/* Header Navigation */}
        <nav className="bg-yellow-100 shadow-md sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 relative">
              {/* Centered Heading and Username */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <div className="text-center">
                  <Link to="/" className="block">
                    <h1 className="text-xl font-bold text-gray-900">
                      Disciplinary Cases Management
                    </h1>
                    <p className="text-sm text-gray-700 mt-1">
                      {user?.username || 'User'}
                    </p>
                  </Link>
                </div>
              </div>
              {/* Log Out Button - Desktop */}
              <div className="hidden md:flex md:items-center md:space-x-4 ml-auto">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
              {/* Log Out Button - Mobile */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log Out</span>
                </button>
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

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleLogoutCancel}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Are you sure you want to Logout?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You will be logged out and redirected to the login page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleLogoutConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes
                </button>
                <button
                  onClick={handleLogoutCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;

