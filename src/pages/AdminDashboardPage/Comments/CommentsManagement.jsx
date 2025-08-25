import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faHome, faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmation from '../DeleteConfirmation.jsx';
import '../AdminStyles.css';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  const navigate = useNavigate();
  
  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/comments?page=${pagination.page}&limit=${pagination.limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setComments(response.data.comments);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (error) {
      setError('Error loading comments');
      setLoading(false);
      console.error('Error fetching comments:', error);
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [pagination.page, pagination.limit]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchComments();
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };
  
  const handleDelete = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/comments/${commentToDelete.Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setShowDeleteModal(false);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleApproveComment = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if(currentStatus == "false") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/comments/${id}/approve`,
          {}, // Empty body as second parameter
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/comments/${id}/reject`,
          { reason: 'Rejected by admin' }, // Optional rejection reason
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      fetchComments();
    } catch (error) {
      console.error('Error updating comment approval status:', error);
      
      // Handle unauthorized error
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };
  
  return (
    <div className="admin-list-container">
      <div className="admin-page-header">
        <div className="header-left">
          <Link to="/admin" className="home-button">
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <h2>Manage Comments</h2>
        </div>
        <Link to="/admin/comments/create" className="create-button">
          <FontAwesomeIcon icon={faPlus} /> New Comment
        </Link>
      </div>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-group">
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} /> Search
            </button>
          </div>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading comments...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Technology</th>
                  <th>Author</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Approved</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <tr key={comment.Id}>
                      <td data-tooltip={comment.Id}>{comment.Id}</td>
                      <td data-tooltip={comment.TechnologyName}>{comment.TechnologyName}</td>
                      <td data-tooltip={comment.Author}>{comment.Author}</td>
                      <td data-tooltip={comment.Text} className="comment-text">
                        {comment.Text.length > 100 
                          ? `${comment.Text.substring(0, 100)}...` 
                          : comment.Text}
                      </td>
                      <td data-tooltip={new Date(comment.CommentDate).toLocaleDateString()}>{new Date(comment.CommentDate).toLocaleDateString()}</td>
                      <td data-tooltip={comment.IsApproved == 'true' ? 'Yes' : 'No'}>
                        {comment.IsApproved == 'true'
                          ? <span className="status approved">Yes</span>
                          : <span className="status pending">No</span>}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleApproveComment(comment.Id, comment.IsApproved)}
                          className={comment.IsApproved ? "reject-button" : "approve-button"}
                          title={comment.IsApproved ? "Reject Comment" : "Approve Comment"}
                        >
                          <FontAwesomeIcon icon={comment.IsApproved ? faTimes : faCheck} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment)}
                          className="delete-button"
                          title="Delete Comment"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No comments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            >
              Last
            </button>
          </div>
        </>
      )}
      
      {showDeleteModal && (
        <DeleteConfirmation
          data={commentToDelete}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CommentsManagement;