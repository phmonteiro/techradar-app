import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import './ItemView.css';
import ProgressTrack from '../ProgressTrack/ProgressTrack.jsx';
import ItemDetails from '../ItemDetails/ItemDetails.jsx';
import Navbar from '../../Navbar/Navbar.jsx';
import LikeButton from '../LikeButton/LikeButton';
import ContactAdminModal from '../../ContactAdminModal/ContactAdminModal.jsx';
import ImageAbstractSection from '../ImageAbstractSection/ImageAbstractSection.jsx';
import CommentsSection from '../../CommentsSection/CommentsSection.jsx';

const ItemView = ({ 
  itemType, // 'technology' or 'trend'
  apiEndpoint, // '/api/technologies' or '/api/trends'
  stageUpdateEndpoint, // stage update API endpoint
  progressStages, // array of stages for progress track
  progressType // 'technology' or 'trend' for different progress track styles
}) => {
  const { generatedId } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch the item details using the generatedId
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}${apiEndpoint}/${generatedId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`Failed to fetch ${itemType} details`);
        }
        setItem(response.data.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${itemType} details`, error);
        setIsLoading(false);
      });
  }, [generatedId, apiEndpoint, itemType]);

  const handleUpdateStage = async (itemLabel, newStage) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}${stageUpdateEndpoint}/${itemLabel}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        setItem(prevItem => ({
          ...prevItem,
          Stage: newStage
        }));
      }
    } catch (error) {
      console.error(`Error updating ${itemType} stage:`, error);
    }
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading {itemType}...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-container">
        <h2>{itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found</h2>
        <p>The {itemType} you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const isAdmin = hasRole && hasRole('admin');
  console.log("itemView isAdmin: "+isAdmin)

  return (
    <div className="item-view">
      <Navbar />
      <div className="item-view-container">
        <div className="item-header">
          <div className="header-content">
            <div className="header-left">
              <h2>{item.Name}</h2>
              <p className="item-description">{item.Description}</p>
            </div>
            <div className="header-actions">
              <LikeButton 
                itemLabel={item.ID} 
                itemType={itemType}
              />
              <button 
                className="contact-admin-btn" 
                onClick={openContactModal}
              >
                Contact Admin
              </button>
            </div>
          </div>
        </div>

        {/* Image and Abstract Section - Above Progress Track */}
        <ImageAbstractSection item={item} />

        {/* Detail Items Row - Horizontal layout */}
        <div className="detail-items-row">
          <div className="detail-item">
            <h3>Stage</h3>
            <span className={`stage-badge ${item.Stage?.toLowerCase()}`}>
              {item.Stage}
            </span>
          </div>
          
          {item.TechnologySegment && (
            <div className="detail-item">
              <h3>Technology Segment</h3>
              <p>{item.TechnologySegment}</p>
            </div>
          )}
          
          {item.TechnologyMaturity && (
            <div className="detail-item">
              <h3>Technology Maturity</h3>
              <p>{item.TechnologyMaturity}</p>
            </div>
          )}
          
          {item.RecommendedAction && (
            <div className="detail-item">
              <h3>Recommended Action</h3>
              <p>{item.RecommendedAction}</p>
            </div>
          )}
          
          {item.ContentSource && (
            <div className="detail-item">
              <h3>Content Source</h3>
              <p>{item.ContentSource}</p>
            </div>
          )}
          
          {item.LastReviewDate && (
            <div className="detail-item">
              <h3>Last Review Date</h3>
              <p>{new Date(item.LastReviewDate).toLocaleDateString('pt-PT')}</p>
            </div>
          )}

          {item.Category && (
            <div className="detail-item">
              <h3>Category</h3>
              <p>{item.Category}</p>
            </div>
          )}
          
          {item.BusinessValue && (
            <div className="detail-item">
              <h3>Business Value</h3>
              <p>{item.BusinessValue}</p>
            </div>
          )}
          
          {item.TechnicalDetails && (
            <div className="detail-item">
              <h3>Technical Details</h3>
              <p>{item.TechnicalDetails}</p>
            </div>
          )}
          
          {item.Timeline && (
            <div className="detail-item">
              <h3>Timeline</h3>
              <p>{item.Timeline}</p>
            </div>
          )}
          
          {item.ExpectedOutcome && (
            <div className="detail-item">
              <h3>Expected Outcome</h3>
              <p>{item.ExpectedOutcome}</p>
            </div>
          )}
        </div>

        <div className="progress-section">
          <ProgressTrack
            currentStage={item.Stage}
            isAdmin={isAdmin}
            itemLabel={item.GeneratedID}
            onStageUpdate={handleUpdateStage}
            stages={progressStages}
            progressType={progressType}
          />
        </div>

        <div className="item-content">
          <ItemDetails 
            item={item} 
            itemType={itemType}
          />
        </div>

        {/* Comments Section */}
        {item && item.GeneratedID && (
          <div className="comments-section-container">
            <CommentsSection 
              generatedId={item.GeneratedID}
              type={itemType}
            />
          </div>
        )}

        <ContactAdminModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          itemLabel={item.GeneratedID}
          itemType={itemType}
        />
      </div>
    </div>
  );
};

export default ItemView;
