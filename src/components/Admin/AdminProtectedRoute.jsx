import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Validate token with backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.status === 200 && response.data.valid) {
          setIsAuthenticated(true);
        } else {
          // Token invalid
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Error validating token
        console.error('Token validation error:', error);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AdminProtectedRoute;