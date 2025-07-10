import React, { useState, useEffect } from 'react';
import './TrendView.css';
import axios from 'axios';
import ProgressTrack from '../../components/ProgressTrack/ProgressTrack.jsx';
import TrendDetails from './TrendDetails.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LikeButton from '../../components/LikeButton/LikeButton';
import ContactAdminModal from '../../components/ContactAdminModal/ContactAdminModal.jsx';
import CommentsSection from '../../components/CommentsSection/CommentsSection.jsx';

const TrendView = () => {
  const { label } = useParams();
  const [trend, setTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);  
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the trend details using the label
    setIsLoading(true);
    axios.get(`http://localhost:3000/api/trends/${label}`,
      {
        headers: {Authorization: `Bearer ${token}` }
      }
    )
    .then(response => {
        if (response.status !== 200) {
          throw new Error('Failed to fetch trend details');
        }
        setTrend(response.data.data);
        setIsLoading(false);
      })
    .catch(error => {
        console.error("Error fetching trend details", error);
        setIsLoading(false);
      });
  }, [label]);

  const handleUpdateStage = async (label, newStage) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/trends/${label}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Update the local state with the updated trend
        setTrend(response.data.data);
      }
    } catch (error) {
      console.error("Error updating trend stage:", error);
      alert("Failed to update trend stage. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!trend) {
    return <div>Trend not found</div>;
  }

  const handleEditTrend = () => {
    // Redirect to the edit trend page
    navigate(`/admin/trends/edit/${trend.Label}`);
  }

  const handleContactAdmin = () => {
    setIsContactModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="trend-card">
        <div className="card-header">
          <div className="title-section">
            <h1>Trend: {trend.Name}</h1>
            <span className="generated-id">Generated ID: TREND-{trend.Id}</span>
          </div>
          <div className="header-actions">
            <LikeButton data={trend} type="trend"/>
            <button className="follow-btn">
              <span className="follow-icon">📋</span>
              Follow
            </button>
            {currentUser && currentUser.role === 'Admin' && <button onClick={handleEditTrend} className="edit-btn">
              <span className="edit-icon">✏️</span>
              Edit
            </button>}
            <button onClick={handleContactAdmin} className="contact-admin-btn">
              <span className="contact-icon">✉️</span>
              Contact Admin
            </button>
          </div>
        </div>

        <div className="content-container">
          <div className="image-container">
            {trend.ImageUrl ? (
              <img 
                src={trend.ImageUrl} 
                alt={trend.Name} 
                className="trend-image" 
              />
            ) : (
              <div className="placeholder-image">No image available</div>
            )}
          </div>
          
          <div className="abstract-container">
            <h2>Abstract</h2>
            <p>{trend.Abstract || 'No abstract available for this trend.'}</p>
          </div>
        </div>

        <ProgressTrack 
          type="trend"
          currentStage={trend.Stage} 
          isAdmin={currentUser && currentUser.role === 'Admin'} 
          label={trend.Label}
          onStageUpdate={handleUpdateStage}
        />
        <TrendDetails trend={trend} />
      </div>

      <ContactAdminModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        label={trend?.Label}
        type="trend"
      />
    </>
  );
};

export default TrendView;