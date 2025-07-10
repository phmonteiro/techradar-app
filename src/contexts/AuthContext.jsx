import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { isTokenExpired, validateToken, handleTokenExpiration } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const isValidToken = await validateToken(token);
        if (!isValidToken) {
          localStorage.removeItem('authToken');
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        setCurrentUser({
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          token
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (usernameCredential, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, {
        usernameCredential,
        password
      });
      
      const { token, userId, username, role } = response.data.data;
      
      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      
      setCurrentUser({
        userId: userId,
        username: username,
        role: role,
        token
      });
      
      return { success: true, user: { userId, username, role } };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Authentication failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    if (requiredRole === 'Admin') {
      return currentUser.role === 'Admin';
    }
    return ['Admin', 'Viewer'].includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Export the context itself as a named export if needed
export { AuthContext };

