import React, { useState, useEffect } from 'react';
import { likeTrend, unlikeTrend } from './likesApi';
import './LikeButton.css';

const LikeButton = ({ trendLabel, isLiked: initialIsLiked, setIsLiked: setParentIsLiked }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isLiked) {
        await unlikeTrend(trendLabel);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likeTrend(trendLabel);
        setLikeCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
      setParentIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <span className="like-icon">❤️</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
