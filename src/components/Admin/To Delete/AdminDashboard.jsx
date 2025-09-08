import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faComment, faBook, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';
import './AdminDashboard.css';
import './AdminTable.css';
import AdminSidebar from '../AdminSidebar'; // Import the sidebar component

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    technologies: { count: 0, loading: true, error: false },
    comments: { count: 0, loading: true, error: false },
    references: { count: 0, loading: true, error: false }
  });

  // Fetch technology count
  useEffect(() => {
    if (!currentUser) return;

    const token = currentUser.token;
    if (!token) return;

    // Fetch technologies count
    axios.get('${import.meta.env.VITE_API_URL}/api/technologies/count', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setStats(prev => ({
          ...prev,
          technologies: { count: response.data.count, loading: false, error: false }
        }));
      })
      .catch(error => {
        console.error('Error fetching technology count:', error);
        setStats(prev => ({
          ...prev,
          technologies: { count: 0, loading: false, error: true }
        }));
      });

    // Fetch comments count
    axios.get('${import.meta.env.VITE_API_URL}/api/comments/count', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setStats(prev => ({
          ...prev,
          comments: { count: response.data.data, loading: false, error: false }
        }));
      })
      .catch(error => {
        console.error('Error fetching comments count:', error);
        setStats(prev => ({
          ...prev,
          comments: { count: 0, loading: false, error: true }
        }));
      });

    // Fetch references count
    axios.get('${import.meta.env.VITE_API_URL}/api/references/count', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setStats(prev => ({
          ...prev,
          references: { count: response.data.data, loading: false, error: false }
        }));
      })
      .catch(error => {
        console.error('Error fetching references count:', error);
        setStats(prev => ({
          ...prev,
          references: { count: 0, loading: false, error: true }
        }));
      });
  }, [currentUser]);

  const renderStatValue = (stat) => {
    if (stat.loading) {
      return <FontAwesomeIcon icon={faSpinner} spin />;
    }
    if (stat.error) {
      return <span className="stat-error">Error</span>;
    }
    return <span className="stat-number">{stat.count}</span>;
  };

  return (
    <>
      <AdminSidebar username={currentUser.username} /> {/* Sidebar component */}
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faLayerGroup} />
            </div>
            <div className="stat-content">
              <h3>Technologies</h3>
              <div className="stat-value">
                {renderStatValue(stats.technologies)}
              </div>
              <Link to="/admin/technologies/create" className="stat-link">Add gfNew Technology</Link>
            <span> </span>
              <Link to="/admin/technologies" className="stat-link">Manage Technologies</Link>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faComment} />
            </div>
            <div className="stat-content">
              <h3>Comments</h3>
              <div className="stat-value">
                {renderStatValue(stats.comments)}
              </div>
              <Link to="/admin/comments" className="stat-link">Manage Comments</Link>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <div className="stat-content">
              <h3>References</h3>
              <div className="stat-value">
                {renderStatValue(stats.references)}
              </div>
              <Link to="/admin/references" className="stat-link">Manage References</Link>
            </div>
          </div>
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/admin/technologies/create" className="action-button">
              Add New Technology
            </Link>
            <span> </span>
            <Link to="/" target="_blank" className="action-button secondary">
              View Public Site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;