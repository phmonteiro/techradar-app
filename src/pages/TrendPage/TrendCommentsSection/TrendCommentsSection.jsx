import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import './TrendCommentsSection.css';

const TrendCommentsSection = ({ label }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (label) {
      fetchComments();
    } else {
      setIsLoading(false);
      setError('No trend label provided');
    }
  }, [label]);

  const fetchComments = async () => {
    if (!label) {
      setError('No trend label provided');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/comments/trend/${label}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setComments(data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !label) return;

    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          content: newComment,
          label: label
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again later.');
    }
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h2>Comments</h2>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
          />
          <button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.Id} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{comment.Author}</span>
                <span className="comment-date">
                  {new Date(comment.CreatedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-content">{comment.Text}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default TrendCommentsSection;