import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page they were trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(userId, password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'Admin') {
          navigate(from);
        } else {
          // Redirect to the page they were trying to access, or default to home
          navigate(from);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="button-wrapper" style={{ marginBottom: '20px' }}>
      <button className="homepage-button" onClick={() => navigate('/')}>Go to Homepage</button>
    </div>
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
