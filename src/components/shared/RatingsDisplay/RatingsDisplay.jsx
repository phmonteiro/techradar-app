import React from 'react';
import './RatingsDisplay.css';

const RatingsDisplay = ({ ratings, title = "Rating" }) => {
  if (!ratings || ratings.length === 0) {
    return null;
  }

  const renderProgressBar = (rating) => {
    const { value, maxValue, label, icon } = rating;
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    
    return (
      <div key={rating.key} className="rating-item">
        <div className="rating-header">
          <span className="rating-label">
            {rating.displayName}:
            {icon && <span className="rating-icon">{icon}</span>}
          </span>
          <div className="rating-count">
            <span className="rating-participants">👤 1</span>
          </div>
        </div>
        
        <div className="rating-bar-container">
          <div className="rating-labels">
            {rating.scaleLabels.map((scaleLabel, index) => (
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

  return (
    <div className="ratings-display">
      <div className="ratings-header">
        <h3>{title}</h3>
        <button className="rate-now-btn">
          <span className="rate-icon">≡</span> Rate now
        </button>
      </div>
      
      <div className="ratings-list">
        {ratings.map(renderProgressBar)}
      </div>
    </div>
  );
};

export default RatingsDisplay;