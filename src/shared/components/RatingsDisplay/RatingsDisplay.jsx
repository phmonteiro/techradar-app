import React, { useState } from 'react';
import RatingModal from '../RatingModal/RatingModal';
import './RatingsDisplay.css';

const RatingsDisplay = ({ ratings, title = "Rating", itemType, generatedId, onRatingsUpdated }) => {
  const [showModal, setShowModal] = useState(false);

  console.log('RatingsDisplay rendered with props:', { itemType, generatedId, ratingsLength: ratings?.length });

  const handleRatingsUpdated = () => {
    if (onRatingsUpdated) {
      onRatingsUpdated();
    }
  };

  const renderProgressBar = (rating) => {
    const { value, maxValue, label, icon } = rating;
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    
    // Handle both old static format and new API format
    const scaleLabels = rating.scaleLabels || [];
    const displayName = rating.displayName || rating.name || 'Rating';
    
    return (
      <div key={rating.key || rating.id} className="rating-item">
        <div className="rating-header">
          <span className="rating-label">
            {displayName}:
            {icon && <span className="rating-icon">{icon}</span>}
          </span>
          <div className="rating-count">
            <span className="rating-participants">👤 {rating.ratingCount || 0}</span>
          </div>
        </div>
        
        <div className="rating-bar-container">
          <div className="rating-labels">
            {scaleLabels.map((scaleLabel, index) => (
              <span key={index} className="scale-label">
                {scaleLabel}
              </span>
            ))}
          </div>
          
          <div className="rating-bar">
            <div 
              className="rating-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
            <div className="rating-markers">
              {Array.from({ length: maxValue + 1 }, (_, index) => (
                <div 
                  key={index} 
                  className={`marker ${index === value ? 'active' : ''}`}
                  style={{ left: `${(index / maxValue) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>
          
          {label && (
            <div className="current-rating-label">
              <strong>{label}</strong>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleRateNowClick = () => {
    console.log('Rate now button clicked!');
    console.log('Props received:', { itemType, generatedId, onRatingsUpdated });
    setShowModal(true);
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  const handleRatingsUpdate = (updatedRatings) => {
    console.log('Ratings updated:', updatedRatings);
    if (onRatingsUpdated) {
      onRatingsUpdated(updatedRatings);
    }
    setShowModal(false);
  };

  return (
    <div className="ratings-display">
      <div className="ratings-header">
        <h3>{title}</h3>
        <button 
          className="rate-now-btn"
          onClick={handleRateNowClick}
          style={{ 
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <span className="rate-icon">≡</span> Rate now
        </button>
      </div>
      
      <div className="ratings-list">
        {ratings && ratings.length > 0 ? (
          ratings.map(renderProgressBar)
        ) : (
          <div className="no-ratings">
            <p>Loading ratings...</p>
          </div>
        )}
      </div>

      {showModal && (
        <RatingModal
          isOpen={showModal}
          onClose={handleModalClose}
          itemType={itemType}
          generatedId={generatedId}
          onRatingsUpdated={handleRatingsUpdate}
        />
      )}
    </div>
  );
};

export default RatingsDisplay;