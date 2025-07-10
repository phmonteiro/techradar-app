import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './TechnologyView.css';
import ProgressTrack from './ProgressTrack.jsx';
import TechDetails from './TechDetails.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import LikeButton from '../../components/LikeButton/LikeButton';
import ContactAdminModal from '../../components/ContactAdminModal/ContactAdminModal.jsx';
import CommentsSection from '../../components/CommentsSection/CommentsSection.jsx';

const TechnologyView = () => {
  const { label } = useParams();
  const [technology, setTechnology] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch the technology details using the label
    setIsLoading(true);
    axios.get(`http://localhost:3000/api/technologies/${label}`,
      {
        headers: {Authorization: `Bearer ${token}` }
      }
    )
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Failed to fetch technology details');
        }
        setTechnology(response.data.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching technology details", error);
        setIsLoading(false);
      });
  }, [label]);

  const handleUpdateStage = async (technologyLabel, newStage) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/technologies/${technologyLabel}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        // Update the local state with the updated technology
        setTechnology(response.data.data);
      }
    } catch (error) {
      console.error("Error updating technology stage:", error);
      alert("Failed to update technology stage. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!technology) {
    return <div>Technology not found</div>;
  }

  const handleEditTehnology = () => {
    // Redirect to the edit technology page
    navigate(`/admin/technologies/edit/${technology.Label}`);
  }

  const handleContactAdmin = () => {
    setIsContactModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="tech-card">
        <div className="card-header">
          <div className="title-section">
            <h1>Technology: {technology.Name}</h1>
            <span className="generated-id">Generated ID: TECH-217</span>
          </div>
          <div className="header-actions">
          <LikeButton data={technology} type="technology" />
            <button className="follow-btn">
              <span className="follow-icon">📋</span>
              Follow
            </button>
            {currentUser && currentUser.role === 'Admin' && <button onClick={handleEditTehnology} className="edit-btn">
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
            {technology.ImageUrl ? (
              <img 
                src={technology.ImageUrl} 
                alt={technology.Name} 
                className="technology-image" 
              />
            ) : (
              <div className="placeholder-image">No image available</div>
            )}
          </div>
          
          <div className="abstract-container">
            <h2>Abstract</h2>
            <p>{technology.Abstract || 'No abstract available for this technology.'}</p>
          </div>
        </div>
        <ProgressTrack 
          type="technology"
          currentStage={technology.Stage} 
          isAdmin={currentUser && currentUser.role === 'Admin'} 
          label={technology.Label}
          onStageUpdate={handleUpdateStage}
        />
        <TechDetails technology={technology} />
      </div>

      <CommentsSection label={label} type="technology" />

      <ContactAdminModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        label={technology?.Label}
        type="technology"
      />
    </>
  );
};

export default TechnologyView; 