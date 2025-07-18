import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../AdminStyles.css';

const CommentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [form, setForm] = useState({
    TechnologyLabel: '',
    Author: '',
    Email: '',
    Text: '',
    IsApproved: false
  });

  // Fetch technologies for dropdown
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('${import.meta.env.VITE_API_URL}api/admin/technologies', {
          headers: { Authorization: `Bearer ${token}` }
        }  );
        setTechnologies(response.data.technologies);
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setError('Failed to load technologies. Please try again later.');
      }
    };

    fetchTechnologies();
  }, []);

  // If editing, fetch the comment data
  useEffect(() => {
    if (!id) return;

    const fetchComment = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/admin/comments/${id}`, {
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
      if (!form.TechnologyLabel || !form.Author || !form.Email || !form.Text) {
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
        await axios.put(`${import.meta.env.VITE_API_URL}api/admin/comments/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Comment updated successfully!');
      } else {
        // Create new comment
        await axios.post('${import.meta.env.VITE_API_URL}api/admin/comments', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Comment created successfully!');
        setForm({
          TechnologyLabel: '',
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
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading comment...</p>
      </div>
    );
  }

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
            {technologies.map(tech => (
              <option key={tech.Id} value={tech.Label}>
                {tech.Name}
              </option>
            ))}
          </select>
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