import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmation from '../DeleteConfirmation.jsx';
import '../styles/index.css';

const TechnologiesManagement = () => {
  const [technologies, setTechnologies] = useState([]);
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
  const [techToDelete, setTechToDelete] = useState(null);
  
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
  
  // Filter technologies based on filter input
  const filteredTechnologies = technologies.filter(tech => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    const formattedDate = formatDate(tech.LastReviewDate);
    
    return (
      tech.Id?.toString().toLowerCase().includes(searchTerm) ||
      tech.Name?.toLowerCase().includes(searchTerm) ||
      tech.Label?.toLowerCase().includes(searchTerm) ||
      tech.Stage?.toLowerCase().includes(searchTerm) ||
      tech.TechnologySegment?.toLowerCase().includes(searchTerm) ||
      formattedDate.toLowerCase().includes(searchTerm)
    );
  });
  
  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/technologies?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setTechnologies(response.data.technologies);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (error) {
      setError('Error loading technologies');
      setLoading(false);
      console.error('Error fetching technologies:', error);
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, [pagination.page, pagination.limit]);
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };
  
  const handleDelete = (tech) => {
    setTechToDelete(tech);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/technologies/${techToDelete.Label}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setShowDeleteModal(false);
      fetchTechnologies();
    } catch (error) {
      console.error('Error deleting technology:', error);
    }
  };
  
  return (
    <div className="admin-list-container">
      <div className="admin-page-header">
        <div className="header-left">
          <Link to="/admin" className="home-button">
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <h2>Manage Technologies</h2>
        </div>
        <Link to="/admin/technologies/create" className="create-button">
          <FontAwesomeIcon icon={faPlus} /> New Technology
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
                  <th>Label</th>
                  <th>Stage</th>
                  <th>Technology Segment</th>
                  <th>Last Review Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechnologies.length > 0 ? (
                  filteredTechnologies.map(tech => (
                    <tr key={tech.Label}>
                      <td data-tooltip={tech.Id}>{tech.Id}</td>
                      <td data-tooltip={tech.Name}>{tech.Name}</td>
                      <td data-tooltip={tech.Label}>{tech.Label}</td>
                      <td data-tooltip={tech.Stage}>{tech.Stage}</td>
                      <td data-tooltip={tech.TechnologySegment}>{tech.TechnologySegment}</td>
                      <td data-tooltip={formatDate(tech.LastReviewDate)}>
                        {formatDate(tech.LastReviewDate)}
                      </td>
                      <td className="actions-cell">
                        <Link 
                          to={`/admin/technologies/edit/${tech.Label}`}
                          className="edit-button"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleDelete(tech)}
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
                      {filter ? 'No technologies match the filter criteria' : 'No technologies found'}
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
          data={techToDelete}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default TechnologiesManagement;