import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const validateToken = async (token) => {
  if (!token) return false;
  try {
    // Debug: Decode and log the token contents
    const decoded = jwtDecode(token);
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.status === 200 && response.data.valid;
  } catch (error) {
    console.error('Token validation error:', error.response?.data || error.message);
    return false;
  }
};

export const handleTokenExpiration = (navigate) => {
  localStorage.removeItem('authToken');
  navigate('/login');
}; 