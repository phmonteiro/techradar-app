import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';
import AdminSidebar from './AdminSidebar'; // Import the sidebar component
import StatCard from './StatCard'; // Import the new StatCard component

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    technologies: { count: 0, loading: true, error: false },
    comments: { count: 0, loading: true, error: false },
    references: { count: 0, loading: true, error: false },
    trends: { count: 0, loading: true, error: false }
  });

  // Fetch technology count
  useEffect(() => {
    if (!currentUser) return;

    const token = currentUser.token;
    if (!token) return;

    // Fetch technologies count
    axios.get(`${import.meta.env.VITE_API_URL}/api/technologies/count`, {
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/comments/count`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const count = typeof response.data?.count === 'number' ? response.data.count : 0;
        setStats(prev => ({
          ...prev,
          comments: { count, loading: false, error: false }
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/references/count`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const count = typeof response.data?.count === 'number' ? response.data.count : 0;
        setStats(prev => ({
          ...prev,
          references: { count, loading: false, error: false }
        }));
      })
      .catch(error => {
        console.error('Error fetching references count:', error);
        setStats(prev => ({
          ...prev,
          references: { count: 0, loading: false, error: true }
        }));
      });

    // Fetch trends count
    axios.get(`${import.meta.env.VITE_API_URL}/api/trends/count`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log(response.data);	
        setStats(prev => ({
          ...prev,
          trends: { count: response.data.count, loading: false, error: false } 
        }));
      })
      .catch(error => {
        console.error('Error fetching trends count:', error);
        setStats(prev => ({
          ...prev,  
          trends: { count: 0, loading: false, error: true }
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
          <StatCard 
            icon="🚀"
            title="Technologies"
            stat={renderStatValue(stats.technologies)}
            buttons={[
              { to: "/admin/technologies/create", text: "Add Technology" },
              { to: "/admin/technologies", text: "Manage Technologies" }
            ]}
          />
          
          <StatCard 
            icon="📈"
            title="Trends"
            stat={renderStatValue(stats.trends)}
            buttons={[
              { to: "/admin/trends/create", text: "Add Trend" },
              { to: "/admin/trends", text: "Manage Trends" }
            ]}
          />

          <StatCard 
            icon="💬"
            title="Comments"
            stat={renderStatValue(stats.comments)}
            buttons={[
              { to: "/admin/comments", text: "Manage Comments" }
            ]}
          />
          
          <StatCard 
            icon="🔗"
            title="References"
            stat={renderStatValue(stats.references)}
            buttons={[
              { to: "/admin/references", text: "Manage References" }
            ]}
          />
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button>
              <Link to="/admin/technologies/create" className="action-button">
                Add New Technology
              </Link>
            </button>
            <button>
              <Link to="/" target="_blank" className="action-button secondary">
                View Public Site
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;