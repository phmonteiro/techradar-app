import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isTokenExpired, validateToken, handleTokenExpiration } from '../utils/tokenUtils';

// This component wraps routes that require authentication/authorization
const ProtectedRoute = ({ children, requiredRole = 'Viewer' }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token || isTokenExpired(token)) {
        handleTokenExpiration(navigate);
        setIsValidating(false);
        return;
      }

      const isValidToken = await validateToken(token);
      setIsValid(isValidToken);
      setIsValidating(false);

      if (!isValidToken) {
        handleTokenExpiration(navigate);
      }
    };

    checkToken();
  }, [navigate]);

  // Allow access to base URL without authentication
  if (location.pathname === '/') {
    return children;
  }
  
  // If still loading auth state or validating token, show loading
  if (loading || isValidating) {
    return <div>Loading...</div>;
  }

  // If not authenticated at all or token is invalid, redirect to login
  if (!currentUser || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole === 'Admin' && currentUser.role !== 'Admin') {
    // User is authenticated but doesn't have admin rights
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
