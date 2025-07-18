import React, { useState, useEffect } from 'react';
import './LikeButton.css';
import axios from 'axios';

const LikeButton = ({ technologyLabel, isLiked, setIsLiked }) => {
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchLikeCount();
    fetchLikeStatus();
  }, [technologyLabel]);

  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/technologies/${technologyLabel}/likes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLikeCount(response.data.data);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/technologies/${technologyLabel}/likes/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsLiked(response.data.data);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/technologies/${technologyLabel}/likes`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''}`}
      onClick={handleLike}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton; 