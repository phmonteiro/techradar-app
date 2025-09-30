import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmation from '../DeleteConfirmation.jsx';
import '../styles/index.css';

const TrendsManagement = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trendToDelete, setTrendToDelete] = useState(null);
  
  const navigate = useNavigate();
  
  // Function to format ISO date to DD-MM-YYYY
  const formatDate = (isoDateString) => {
    if (!isoDateString) return '';
    
    try {
      const date = new Date(isoDateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return isoDateString;
      
      // Format as DD-MM-YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return isoDateString;
    }
  };
  
  // Filter trends based on filter input
  const filteredTrends = trends.filter(trend => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    const formattedDate = formatDate(trend.LastReviewDate);
    
    return (
      trend.Id?.toString().toLowerCase().includes(searchTerm) ||
      trend.Name?.toLowerCase().includes(searchTerm) ||
      trend.GeneratedID?.toLowerCase().includes(searchTerm) ||
      trend.Stage?.toLowerCase().includes(searchTerm) ||
      trend.TechnologySegment?.toLowerCase().includes(searchTerm) ||
      formattedDate.toLowerCase().includes(searchTerm)
    );
  });
  
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/trends?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTrends(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (error) {
      setError('Error loading trends');
      setLoading(false);
      console.error('Error fetching trends:', error);
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [pagination.page, pagination.limit]);
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };
  
  const handleDelete = (trend) => {
    setTrendToDelete(trend);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/trends/${trendToDelete.GeneratedID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setShowDeleteModal(false);
      fetchTrends();
    } catch (error) {
      console.error('Error deleting trend:', error);
    }
  };
  
  return (
    <div className="admin-list-container">
      <div className="admin-page-header">
        <div className="header-left">
          <Link to="/admin" className="home-button">
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <h2>Manage Trends</h2>
        </div>
        <Link to="/admin/trends/create" className="create-button">
          <FontAwesomeIcon icon={faPlus} /> New Trend
        </Link>
      </div>
      
      <div className="search-container">
        <div className="search-group">
          <input
            type="text"
            placeholder="Filter all fields..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button type="button">
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>GeneratedID</th>
                  <th>Stage</th>
                  <th>Technology Segment</th>
                  <th>Last Review Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrends.length > 0 ? (
                  filteredTrends.map(trend => (
                    <tr key={trend.GeneratedID}>
                      <td data-tooltip={trend.Id}>{trend.Id}</td>
                      <td data-tooltip={trend.Name}>{trend.Name}</td>
                      <td data-tooltip={trend.GeneratedID}>{trend.GeneratedID}</td>
                      <td data-tooltip={trend.Stage}>{trend.Stage}</td>
                      <td data-tooltip={trend.TechnologySegment}>{trend.TechnologySegment}</td>
                      <td data-tooltip={formatDate(trend.LastReviewDate)}>
                        {formatDate(trend.LastReviewDate)}
                      </td>
                      <td className="actions-cell">
                        <Link 
                          to={`/admin/trends/edit/${trend.GeneratedID}`}
                          className="edit-button"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleDelete(trend)}
                          className="delete-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      {filter ? 'No trends match the filter criteria' : 'No trends found'}
                    </td>
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
          data={trendToDelete}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default TrendsManagement;