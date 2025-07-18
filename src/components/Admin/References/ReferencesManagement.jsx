import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import DeleteReferenceConfirmation from './DeleteReferenceConfirmation.jsx';
import '../AdminStyles.css';

const ReferencesManagement = () => {
  const [references, setReferences] = useState([]);
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
  const [referenceToDelete, setReferenceToDelete] = useState(null);
  
  const navigate = useNavigate();
  
  const fetchReferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/references?page=${pagination.page}&limit=${pagination.limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setReferences(response.data.references);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (error) {
      setError('Error loading references');
      setLoading(false);
      console.error('Error fetching references:', error);
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };
  
  useEffect(() => {
    fetchReferences();
  }, [pagination.page, pagination.limit]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchReferences();
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };
  
  const handleDelete = (reference) => {
    setReferenceToDelete(reference);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/references/${referenceToDelete.Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setShowDeleteModal(false);
      fetchReferences();
    } catch (error) {
      console.error('Error deleting reference:', error);
    }
  };
  
  return (
    <div className="admin-list-container">
      <div className="admin-page-header">
        <div className="header-left">
          <Link to="/admin" className="home-button">
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <h2>Manage References</h2>
        </div>
        <Link to="/admin/references/create" className="create-button">
          <FontAwesomeIcon icon={faPlus} /> New Reference
        </Link>
      </div>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-group">
            <input
              type="text"
              placeholder="Search references..."
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
        <div>Loading...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Technology</th>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Source</th>
                  <th>Publication Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {references.length > 0 ? (
                  references.map(reference => (
                    <tr key={reference.Id}>
                      <td data-tooltip={reference.Id}>{reference.Id}</td>
                      <td data-tooltip={reference.TechnologyLabel}>{reference.TechnologyLabel}</td>
                      <td data-tooltip={reference.Title}>{reference.Title}</td>
                      <td data-tooltip={reference.Url}>{reference.Url}</td>
                      <td data-tooltip={reference.Source}>{reference.Source}</td>
                      <td data-tooltip={reference.PublicationDate}>{reference.PublicationDate}</td>
                      <td className="actions-cell">
                        <Link 
                          to={`/admin/references/edit/${reference.Id}`}
                          className="edit-button"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleDelete(reference)}
                          className="delete-button"
                          title="Delete Reference"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No references found</td>
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
        <DeleteReferenceConfirmation
          reference={referenceToDelete}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ReferencesManagement;