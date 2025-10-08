import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserRatingsForItem, updateUserRatings } from '../../../services/ratingsService';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, itemType, generatedId, onRatingsUpdated }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const { currentUser } = useAuth();

  // Load ratings when modal opens
  useEffect(() => {
    if (isOpen && generatedId && itemType) {
      loadRatings();
    }
  }, [isOpen, generatedId, itemType]);

  const loadRatings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required to load your ratings');
      }

      console.log('🔄 Loading user-specific ratings via service...');
      console.log('📋 Parameters:', { itemType, generatedId });
      
      const apiRatings = await getUserRatingsForItem(itemType, generatedId, token);
      console.log('📊 API Response data:', apiRatings);
      
      // Transform the API response to match our rating format
      const transformedRatings = apiRatings.map(rating => {
        const scaleLabels = JSON.parse(rating.ScaleLabels || '[]');
        return {
          key: rating.RatingKey,
          displayName: rating.DisplayName,
          category: rating.Category,
          value: rating.RatingValue, // Will be 0 for unrated items (lowest value)
          maxValue: rating.MaxValue,
          label: rating.RatingLabel, // Will be first scale label for unrated items
          scaleLabels: scaleLabels,
          icon: rating.Icon,
          originalValue: rating.RatingValue // Keep track of original value
        };
      });
      
      console.log('✅ Transformed user ratings:', transformedRatings);
      setRatings(transformedRatings);
    } catch (error) {
      console.error('❌ Error loading ratings:', error);
      setError(error.message || 'Failed to load ratings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (ratingKey, newValue) => {
    setRatings(prevRatings => {
      const updated = prevRatings.map(rating => {
        if (rating.key === ratingKey) {
          const scaleLabels = rating.scaleLabels || [];
          const newLabel = scaleLabels[newValue] || 'Custom Rating';
          
          return {
            ...rating,
            value: newValue,
            label: newLabel
          };
        }
        return rating;
      });
      
      // Check if any rating has changed from its original value
      const hasAnyChanges = updated.some(rating => rating.value !== rating.originalValue);
      setHasChanges(hasAnyChanges);
      
      return updated;
    });
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError('You must be logged in to save ratings');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare ratings data for API
      const ratingsData = ratings.map(rating => ({
        ratingKey: rating.key,
        ratingValue: rating.value,
        ratingLabel: rating.label,
        maxValue: rating.maxValue
      }));

      console.log('🚀 Saving ratings via service...');
      console.log('📊 Ratings data:', ratingsData);

      const token = localStorage.getItem('authToken');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        throw new Error('No auth token found. Please log in again.');
      }

      const responseData = await updateUserRatings(itemType, generatedId, ratingsData, token);
      console.log('✅ Save successful:', responseData);

      // Update original values to match current values
      setRatings(prevRatings => 
        prevRatings.map(rating => ({
          ...rating,
          originalValue: rating.value
        }))
      );
      
      setHasChanges(false);
      
      // Notify parent component that ratings were updated
      console.log('🔄 Calling onRatingsUpdated callback...');
      if (onRatingsUpdated) {
        onRatingsUpdated();
      }
      
      // Close modal after successful save
      console.log('🚪 Closing modal...');
      onClose();

    } catch (error) {
      console.error('Error saving ratings:', error);
      setError(error.message || 'Failed to save ratings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmed) return;
    }
    
    // Reset ratings to original values
    setRatings(prevRatings => 
      prevRatings.map(rating => ({
        ...rating,
        value: rating.originalValue,
        label: rating.scaleLabels[rating.originalValue] || 'Not Rated'
      }))
    );
    
    setHasChanges(false);
    onClose();
  };

  const renderRatingSlider = (rating) => {
    const { key, displayName, value, maxValue, scaleLabels, icon } = rating;
    
    return (
      <div key={key} className="rating-slider-container">
        <div className="rating-slider-header">
          <span className="rating-slider-label">
            {icon && <span className="rating-icon">{icon}</span>}
            {displayName}
          </span>
          <span className="rating-value-display">
            {scaleLabels[value] || value}
          </span>
        </div>
        
        <div className="rating-slider-wrapper">
          <input
            type="range"
            min="0"
            max={maxValue}
            value={value}
            onChange={(e) => handleRatingChange(key, parseInt(e.target.value))}
            className="rating-slider"
          />
          
          <div className="rating-scale-labels">
            {scaleLabels.map((label, index) => (
              <span
                key={index}
                className={`scale-label ${index === value ? 'active' : ''}`}
                style={{ left: `${(index / maxValue) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  console.log('RatingModal render:', { isOpen, itemType, generatedId });

  if (!isOpen) return null;

  return (
    <div className="rating-modal-overlay" onClick={handleDiscard}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rating-modal-header">
          <h2>Rate {itemType === 'technology' ? 'Technology' : 'Trend'}</h2>
          <button className="close-button" onClick={handleDiscard}>
            ✕
          </button>
        </div>
        
        <div className="rating-modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading ratings...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={loadRatings} className="retry-button">
                Try Again
              </button>
            </div>
          ) : (
            <div className="ratings-form">
              {console.log('Rendering ratings form, ratings array:', ratings)}
              {ratings.length === 0 ? (
                <div style={{color: '#666', textAlign: 'center', padding: '20px'}}>
                  <p>No ratings available.</p>
                  <p>Debugging info:</p>
                  <ul style={{textAlign: 'left', maxWidth: '300px', margin: '0 auto'}}>
                    <li>Item Type: {itemType || 'undefined'}</li>
                    <li>Generated ID: {generatedId || 'undefined'}</li>
                    <li>Loading: {loading ? 'Yes' : 'No'}</li>
                    <li>Error: {error || 'None'}</li>
                    <li>Ratings Array Length: {ratings.length}</li>
                  </ul>
                </div>
              ) : (
                ratings.map(renderRatingSlider)
              )}
            </div>
          )}
        </div>
        
        <div className="rating-modal-footer">
          <button 
            className="discard-button" 
            onClick={handleDiscard}
            disabled={saving}
          >
            {hasChanges ? 'Discard Changes' : 'Cancel'}
          </button>
          
          <button 
            className={`save-button ${hasChanges ? 'has-changes' : ''}`}
            onClick={handleSave}
            disabled={saving || loading || !hasChanges}
          >
            {saving ? 'Saving...' : 'Save Ratings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;