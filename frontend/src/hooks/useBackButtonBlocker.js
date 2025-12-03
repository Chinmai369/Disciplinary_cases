import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useBackButtonBlocker = (isAuthenticated, logout) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const isBlockingRef = useRef(false);
  const hasPushedStateRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasPushedStateRef.current = false;
      return;
    }

    // Check if we're on a protected route
    const protectedRoutes = ['/', '/cases'];
    const isOnProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isOnProtectedRoute) {
      hasPushedStateRef.current = false;
      return;
    }

    // Push a dummy state to intercept back button
    if (!hasPushedStateRef.current) {
      window.history.pushState({ preventBack: true }, '', location.pathname);
      hasPushedStateRef.current = true;
    }

    const handlePopState = (event) => {
      if (isBlockingRef.current) {
        // Already handling a confirmation, ignore
        return;
      }

      // Check if this is a back navigation we should block
      if (event.state && event.state.preventBack) {
        // This is our dummy state, allow it
        return;
      }

      // User is trying to go back - block it
      isBlockingRef.current = true;
      setShowConfirm(true);
      
      // Push the state back to prevent navigation
      window.history.pushState({ preventBack: true }, '', location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, location.pathname]);

  const handleConfirm = () => {
    setShowConfirm(false);
    isBlockingRef.current = false;
    hasPushedStateRef.current = false;
    // Logout and navigate to login
    logout();
    navigate('/login', { replace: true });
  };

  const handleCancel = () => {
    setShowConfirm(false);
    isBlockingRef.current = false;
    // Push state again to stay on current page
    window.history.pushState({ preventBack: true }, '', location.pathname);
    hasPushedStateRef.current = true;
  };

  return {
    showConfirm,
    handleConfirm,
    handleCancel
  };
};

export default useBackButtonBlocker;

