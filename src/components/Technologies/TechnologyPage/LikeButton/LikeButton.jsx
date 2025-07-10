import React, { useState, useEffect, useRef } from 'react';
import { likeTechnology, unlikeTechnology, getLikeCount, getUserLikeStatus } from './likesApi';
import './LikeButton.css';

const LikeButton = ({ technologyLabel }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true); // Add this line

  useEffect(() => {
    fetchLikeCount();
    fetchUserLikeStatus();
  }, [technologyLabel]);

    useEffect(() => {
    return () => {
      isMounted.current = false; // Cleanup
    };
  }, []);

  const fetchLikeCount = async () => {
    try {
      const data = await getLikeCount(technologyLabel);
      const likeCount =  data?.data;
      if (!likeCount) {
        console.error('Like count is undefined or null');
        return;
      }
      setLikes(likeCount);
    } catch (error) {
      console.error('Failed to fetch like count:', error);
    }
  };

  const fetchUserLikeStatus = async () => {
    try {
      const likeStatus = await getUserLikeStatus(technologyLabel);
      if (likeStatus === "liked") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Failed to fetch user like status:', error);
    }
  };

const handleLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {      
      const response = await likeTechnology(technologyLabel);
      if (isLiked) {
          setIsLiked(false);
          setLikes((prev) => Math.max(0, prev - 1));
      } else {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="like-button-container">
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`} 
        onClick={handleLikeToggle}
        disabled={isLoading}
      >
        <span className="like-icon">{isLiked ? '♥' : '♡'}</span>
        <span className="like-count">{likes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
