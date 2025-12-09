import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Menu from './Menu';
import Header from './Header';
import ExitConfirmationModal from './ExitConfirmationModal';
import useBackButtonBlocker from '../hooks/useBackButtonBlocker';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  
  // Handle back button blocking with confirmation
  const { showConfirm, handleConfirm, handleCancel } = useBackButtonBlocker(isAuthenticated, logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Menu */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">
        <Menu isCollapsed={isMenuCollapsed} onCollapseChange={setIsMenuCollapsed} />
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isMenuCollapsed ? 'lg:pl-16' : 'lg:pl-56'}`}>
        {/* Header Navigation */}
        <Header user={user} onLogout={handleLogout} />

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
    </div>
  );
};

export default Layout;

