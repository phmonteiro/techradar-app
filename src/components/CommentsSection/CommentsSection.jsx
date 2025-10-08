import React, { useState, useEffect, useCallback } from 'react';
import './CommentsSection.css';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommentsSection = ({ generatedId, type }) => {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const { currentUser } = useAuth ? useAuth() : { currentUser: null };
  const authToken = localStorage.getItem('authToken');

  const commentsPerPage = 6;
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  
  const fetchComments = useCallback(async () => {
    
    if (!generatedId || !type) {
      console.error('Missing required props:', { generatedId, type });
      setError('Missing generatedId or type for comments.');
      setIsCommentsLoading(false);
      return;
    }
    
    try {
      setIsCommentsLoading(true);
      setError(null);
      
      const url = `${API_URL}/api/comments/${type}/${generatedId}?page=${currentPage}&limit=${commentsPerPage}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setComments(Array.isArray(response.data.comments) ? response.data.comments : Array.isArray(response.data.data) ? response.data.data : []);
      setTotalComments(response.data.total || response.data.count || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsCommentsLoading(false);
    }
  }, [generatedId, type, authToken, currentPage, commentsPerPage]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!generatedId || !type) {
      setError('Missing generatedId or type for comments.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URL}/api/comments/${type}/${generatedId}`, {
        text: commentText,
        generatedId,
        type
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      setCommentText('');
      // Reset to first page when adding a new comment
      setCurrentPage(1);
      await fetchComments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ← Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className="pagination-number">
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">⋯</span>}
          </>
        )}
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`pagination-number ${number === currentPage ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">⋯</span>}
            <button onClick={() => handlePageChange(totalPages)} className="pagination-number">
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next →
        </button>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h2>Comments ({totalComments || 0})</h2>
        <button className="sort-btn" disabled={isCommentsLoading}>
          Sort by Latest
        </button>
      </div>
      
      {isCommentsLoading ? (
        <div className="comments-loading">
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💭</div>
          Loading comments...
        </div>
      ) : error ? (
        <div className="error-message">
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚠️</div>
          {error}
        </div>
      ) : comments?.length > 0 ? (
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div 
              className="comment" 
              key={comment.Id}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease forwards'
              }}
            >
              <p>
                <strong>{comment.Author || 'Anonymous User'}</strong>
                {comment.Text}
              </p>
              <small className="comment-date">
                {formatDate(comment.CreatedAt)}
              </small>
            </div>
          ))}
          {renderPagination()}
        </div>
      ) : (
        <div className="comments-container">
          <div className="comment" style={{ textAlign: 'center', border: '2px dashed #e5e7eb' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤔</div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        </div>
      )}
      
      {currentUser && authToken && (
        <div className="new-comment-section">
          <h2>Share Your Thoughts</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={handleCommentChange}
              placeholder="What are your thoughts on this? Share your insights, experiences, or questions..."
              required
              disabled={isLoading}
              maxLength={1000}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                {commentText.length}/1000 characters
              </span>
              <button 
                type="submit" 
                disabled={isLoading || !commentText.trim()}
              >
                {isLoading ? (
                  <>
                    <span style={{ marginRight: '8px' }}>⏳</span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '8px' }}>🚀</span>
                    Publish Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;