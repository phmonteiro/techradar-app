import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/index.css';

const CommentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [trends, setTrends] = useState([]);
  const [form, setForm] = useState({
    Type: 'technology', // Default to technology
    Label: '', // This will replace TechnologyLabel
    Author: '',
    Email: '',
    Text: '',
    IsApproved: false
  });

  // Debug logging
  console.log('CommentForm rendering, id:', id);
  console.log('Loading state:', loading);
  console.log('Error state:', error);
  console.log('Technologies:', technologies);

  // Fetch technologies and trends for dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Fetching technologies and trends with token:', token ? 'Present' : 'Missing');
        
        // Fetch technologies
        const techResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/technologies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch trends
        const trendsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/trends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Technologies response:', techResponse.data);
        console.log('Trends response:', trendsResponse.data);
        
        // Handle different possible response structures
        const technologiesData = techResponse.data.technologies || techResponse.data.data || techResponse.data;
        const trendsData = trendsResponse.data.trends || trendsResponse.data.data || trendsResponse.data;
        
        setTechnologies(Array.isArray(technologiesData) ? technologiesData : []);
        setTrends(Array.isArray(trendsData) ? trendsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load technologies and trends. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // If editing, fetch the comment data
  useEffect(() => {
    if (!id) return;

    const fetchComment = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/comments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comment:', error);
        setError('Failed to load comment. Please try again later.');
        setLoading(false);
        
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchComment();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Form validation
      if (!form.Type || !form.Label || !form.Author || !form.Email || !form.Text) {
        setError('Please fill all required fields');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.Email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (id) {
        // Update existing comment
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/comments/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Comment updated successfully!');
      } else {
        // Create new comment
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/comments`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Comment created successfully!');
        setForm({
          Type: 'technology',
          Label: '',
          Author: '',
          Email: '',
          Text: '',
          IsApproved: false
        });
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      setError('Failed to save comment. Please try again later.');
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading comment...</p>
      </div>
    );
  }

  console.log('Rendering main form');
  
  return (
    <div className="admin-form-container">
      <div className="admin-page-header">
        <h2>{id ? 'Edit Comment' : 'Create Comment'}</h2>
        <Link to="/admin/comments" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Comments
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Type">Type *</label>
            <select
              id="Type"
              name="Type"
              value={form.Type}
              onChange={handleChange}
              required
            >
              <option value="technology">Technology</option>
              <option value="trend">Trend</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Label">{form.Type === 'technology' ? 'Technology' : 'Trend'} *</label>
            <select
              id="Label"
              name="Label"
              value={form.Label}
              onChange={handleChange}
              required
            >
              <option value="">Select a {form.Type}</option>
              {form.Type === 'technology' 
                ? technologies.map(tech => (
                    <option key={tech.Id || tech.Label} value={tech.Label}>
                      {tech.Name}
                    </option>
                  ))
                : trends.map(trend => (
                    <option key={trend.Id || trend.Label} value={trend.Label}>
                      {trend.Name}
                    </option>
                  ))
              }
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="Author">Author Name *</label>
            <input
              type="text"
              id="Author"
              name="Author"
              value={form.Author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group half">
            <label htmlFor="Email">Email *</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="Text">Comment Text *</label>
          <textarea
            id="Text"
            name="Text"
            value={form.Text}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="IsApproved"
            name="IsApproved"
            checked={form.IsApproved}
            onChange={handleChange}
          />
          <label htmlFor="IsApproved">Approve Comment</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faSave} /> {id ? 'Update Comment' : 'Create Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;