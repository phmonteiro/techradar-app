import React, { useState, useEffect } from 'react';
import './LikeButton.css';
import axios from 'axios';

const LikeButton = ({ 
  itemLabel, 
  itemType, // 'technology' or 'trend'
  isLiked: initialIsLiked, 
  setIsLiked: setParentIsLiked 
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchLikeCount();
    fetchLikeStatus();
  }, [itemLabel, itemType]);

  useEffect(() => {
    if (initialIsLiked !== undefined) {
      setIsLiked(initialIsLiked);
    }
  }, [initialIsLiked]);

  const fetchLikeCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/likes/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referenceId: itemLabel,
          referenceType: itemType
        })
      });
      const data = await response.json();
      setLikeCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/likes/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referenceId: itemLabel,
          referenceType: itemType
        })
      });
      const data = await response.json();
      setIsLiked(data.isLiked || false);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const endpoint = isLiked ? '/api/likes/unlike' : '/api/likes/like';
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referenceId: itemLabel,
          referenceType: itemType
        })
      });

      if (response.ok) {
        if (isLiked) {
          setLikeCount(prev => Math.max(0, prev - 1));
        } else {
          setLikeCount(prev => prev + 1);
        }
        
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        
        // Update parent component if callback provided
        if (setParentIsLiked) {
          setParentIsLiked(newLikedState);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`like-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleLike}
      disabled={isLoading}
      title={isLiked ? `Unlike this ${itemType}` : `Like this ${itemType}`}
    >
      <span className="like-icon">
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span className="like-count">{likeCount}</span>
      {isLoading && <span className="loading-spinner">⟳</span>}
    </button>
  );
};

export default LikeButton;
