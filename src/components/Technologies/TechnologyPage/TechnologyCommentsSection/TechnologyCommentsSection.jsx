import React, { useState, useEffect, useCallback } from 'react';
import './TechnologyCommentsSection.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TechnologyCommentsSection = ({ technologyLabel }) => {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const authToken = localStorage.getItem('authToken');

const fetchComments = useCallback(async () => {
  try {
    setIsCommentsLoading(true);
    
    const response = await axios.get(`${API_URL}/api/comments/technology/${technologyLabel}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // Axios automatically parses JSON and puts the data in response.data
    setComments(response.data.data || []);
  } catch (error) {
    console.error("Error fetching comments:", error.response?.data || error.message);
    setError('Failed to load comments. Please try again later.');
  } finally {
    setIsCommentsLoading(false);
  }
}, [technologyLabel]);

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

  try {
    await axios.post(`${API_URL}/api/comments/technology/${technologyLabel}`, {
      text: commentText,
      technologyLabel
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken} `
      }
    });

    setCommentText('');
    await fetchComments(); // Refresh comments after successful submission
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to submit comment');
    console.error("Error submitting comment:", error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <>    
      <div className="comments-section">
        <div className="comments-header">
          <h2>Comments ({comments?.length || 0})</h2>
          <button className="sort-btn" disabled={isCommentsLoading}>
            Sort <span>▼</span>
          </button>
        </div>

        {isCommentsLoading ? (
          <div className="comments-loading">Loading comments...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : comments?.length > 0 ? (
          comments.map(comment => (
            <div className="comment" key={comment.Id}>
              <p>
                <strong>{comment.Author || 'Anonymous'}:</strong> {comment.Text}
              </p>
              <small className="comment-date">
                {new Date(comment.CreatedAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <div className="comment">
            <p>No comments yet.</p>
          </div>
        )}
      </div>

      {authToken && <div className="new-comment-section">
        <h2>Add a Comment</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !commentText.trim()}
          >
            {isLoading ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>}
    </>
  );
};

export default TechnologyCommentsSection;