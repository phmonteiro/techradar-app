import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      {location.pathname === '/trendradar' ? (
        <Link to="/">Technology Radar</Link>
      ) : (
        <Link to="/trendradar">Trend Radar</Link>
      )}
      <Link to="/technologies">Technologies</Link>
      <Link to="/trends">Trends</Link>
      {currentUser && currentUser.role === 'Admin' && (
        <Link to="/admin">Admin Dashboard</Link>
      )}
      {currentUser ? (
        <button onClick={logout} className="logout-link">Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {currentUser && (
        <span className="user-role-debug">
          {currentUser.userId} ({currentUser.role})
        </span>
      )}
    </div>
  );
};

export default Navbar;