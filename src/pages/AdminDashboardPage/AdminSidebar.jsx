import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ username, onLogout }) => {
  return (
    <div className="admin-sidebar">
      <div>
        <h2>Tech Radar Admin</h2>
      </div>
      <nav>
        <ul>
          <li><Link to="/admin/technologies">Technologies</Link></li>
          <li><Link to="/admin/trends">Trends</Link></li>
          <li><Link to="/admin/comments">Comments</Link></li>
          <li><Link to="/admin/references">References</Link></li>
        </ul>
      </nav>
      <p></p>
      <div className="user-info">
          <span>Logged in as: {username}</span>
          <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
      </div>

 
  );
};

export default AdminSidebar;
