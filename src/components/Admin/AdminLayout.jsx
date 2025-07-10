import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminStyles.css';

const AdminLayout = () => {
  
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Tech Radar Admin</h1>
        <div className="user-info">
          <span>Logged in as: {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="admin-container">
        <nav className="admin-sidebar">
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/technologies">Technologies</Link></li>
            <li><Link to="/admin/comments">Comments</Link></li>
            <li><Link to="/admin/references">References</Link></li>
          </ul>
        </nav>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;