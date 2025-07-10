import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './LikeButton.css';

const LikeButton = ({ data, type }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchLikeStatus();
    }
    fetchLikeCount();
  }, [currentUser, data.ID]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/likes/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          referenceId: data.ID,
          referenceType: type
        })
      });
      const responseData = await response.json();
      setIsLiked(responseData.isLiked);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/likes/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          referenceId: data.ID,
          referenceType: type
        })
      });
      const responseData = await response.json();
      setLikeCount(responseData.count);
    } catch (error) {
      console.error('Error fetching like count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      console.log('endpoint');
      console.log(endpoint);
      const response = await fetch(`http://localhost:3000/api/likes/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          referenceId: data.ID,
          referenceType: type
        })
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (isLoading) {
    return <div className="like-button loading">Loading...</div>;
  }

  return (
    <button 
      className={`like-button ${isLiked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={!currentUser}
      title={!currentUser ? 'Please login to like' : ''}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton; 