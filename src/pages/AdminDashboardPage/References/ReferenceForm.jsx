import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../AdminStyles.css';

const ReferenceForm = () => {
  const { id } = useParams();
  const { label } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [form, setForm] = useState({
    TechnologyLabel: label ? label : '',
    Title: '',
    Url: '',
    Source: '',
    PublicationDate: ''
  });

  // Fetch technologies for dropdown
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('${import.meta.env.VITE_API_URL}/api/admin/technologies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTechnologies(response.data.technologies);
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setError('Failed to load technologies. Please try again later.');
      }
    };

    fetchTechnologies();
  }, []);

  // If editing, fetch the reference data
  useEffect(() => {
    if (!id) return;

    const fetchReference = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/references/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Format the date for the input field
        const data = { ...response.data };
        if (data.PublicationDate) {
          const date = new Date(data.PublicationDate);
          data.PublicationDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        
        setForm(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reference:', error);
        setError('Failed to load reference. Please try again later.');
        setLoading(false);
        
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchReference();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Form validation
      if (!form.TechnologyLabel || !form.Title || !form.Url) {
        setError('Please fill all required fields');
        return;
      }
      
      // URL validation
      try {
        new URL(form.Url); // This will throw if the URL is invalid
      } catch (e) {
        setError('Please enter a valid URL (including http:// or https://)');
        return;
      }
      
      if (id) {
        // Update existing reference
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/references/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Reference updated successfully!');
      } else {
        // Create new reference
        await axios.post('${import.meta.env.VITE_API_URL}/api/admin/references', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Reference created successfully!');
        setForm({
          TechnologyLabel: '',
          Title: '',
          Url: '',
          Source: '',
          PublicationDate: ''
        });
      }
    } catch (error) {
      console.error('Error saving reference:', error);
      setError('Failed to save reference. Please try again later.');
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading reference...</p>
      </div>
    );
  }

  return (
    <div className="admin-form-container">
      <div className="admin-page-header">
        <h2>{id ? 'Edit Reference' : 'Create Reference'}</h2>
        <Link to="/admin/references" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to References
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="TechnologyLabel">Technology *</label>
          <select
            id="TechnologyLabel"
            name="TechnologyLabel"
            value={form.TechnologyLabel}
            onChange={handleChange}
            required
          >
            <option value="">Select a technology</option>
            {technologies.length > 0 ? technologies.map(tech => (
              <option key={tech.Label} value={tech.Label}>
                {tech.Name}
              </option>
            )) : null}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Title">Title *</label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Url">URL *</label>
          <input
            type="url"
            id="Url"
            name="Url"
            value={form.Url}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="Source">Source</label>
            <input
              type="text"
              id="Source"
              name="Source"
              value={form.Source}
              onChange={handleChange}
              placeholder="e.g., Company Blog, Article, etc."
            />
          </div>

          <div className="form-group half">
            <label htmlFor="PublicationDate">Publication Date</label>
            <input
              type="date"
              id="PublicationDate"
              name="PublicationDate"
              value={form.PublicationDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faSave} /> {id ? 'Update Reference' : 'Create Reference'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReferenceForm;