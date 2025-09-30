import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/index.css';
import './TrendForm.css'; // Add specific styles

const TrendForm = () => {
  const { generatedId } = useParams();
  const isEditing = !!generatedId;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    GeneratedID: '',
    Name: '',
    Abstract: '',
    Stage: '',
    Quadrant: '', // Added new Quadrant field
    Ring: '', // Added new Ring field
    Likes: 0, // Add Likes field with default value 0
    DefinitionAndScope: '',
    RelevanceAndImpact: '',
    LabelSegment: '',
    LabelMaturity: '',
    RecommendedAction: '',
    ContentSource: '',
    LastReviewDate: '',
    ImageUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  
  // Fetch trend data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchTrend = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            navigate('/login');
            return;
          }
          
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/trends/${generatedId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          // Format date for the date input if it exists
          const trend = response.data.data
          
          if (!trend) {
            setError('GeneratedID not found');
            setLoading(false);
            return;
          }
          if (!trend.GeneratedID) {
            setError('GeneratedID is required');
            setLoading(false);
            return;
          }
          if (trend.LastReviewDate) {
            // Ensure date is in YYYY-MM-DD format for input[type="date"]
            const formattedDate = trend.LastReviewDate.split('T')[0];
            trend.LastReviewDate = formattedDate;
          }
          
          setFormData(trend);
          if (trend.ImageUrl) {
            setImagePreview(trend.ImageUrl);
          }
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            navigate('/login');
          } else {
            setError('Error loading trend data. Please try again.');
            setLoading(false);
            console.error('Error fetching trend:', error);
          }
        }
      };
      
      fetchTrend();
    }
  }, [generatedId, isEditing, navigate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle image URL change with preview
  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, ImageUrl: value });
    setImagePreview(value);
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.Name.trim()) {
      errors.Name = 'Name is required';
    }
    
    if (!isEditing && !formData.GeneratedID.trim()) {
      errors.GeneratedID = 'GeneratedID is required';
    } else if (!isEditing && !/^[a-z0-9-]+$/.test(formData.GeneratedID)) {
      errors.GeneratedID = 'GeneratedID should contain only lowercase letters, numbers, and hyphens';
    }
    
    // Add validation for URL format if ImageUrl is provided
    if (formData.ImageUrl && !formData.ImageUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      errors.ImageUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Prepare data with correct types
      const submissionData = {
        ...formData,
        // Convert string values to integers for database columns expecting INT
        Quadrant: formData.Quadrant ? parseInt(formData.Quadrant, 10) : null,
        Ring: formData.Ring ? parseInt(formData.Ring, 10) : null
      };
      
      if (isEditing) {
        // Update existing trend
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/trends/${generatedId}`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccessMessage('Trend updated successfully!');
      } else {
        // Create new trend
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/trends`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccessMessage('New trend created successfully!');
      }
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/admin/trends');
      }, 1500);
    } catch (error) {
      setSubmitting(false);
      
      if (error.response) {
        if (error.response.status === 401) {
          navigate('/login');
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Error ${isEditing ? 'updating' : 'creating'} trend (${error.response.status})`);
        }
      } else {
        setError(`Error ${isEditing ? 'updating' : 'creating'} trend. Please try again.`);
      }
      console.error('Error saving trend:', error);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    navigate('/admin/trends');
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading trend data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-form-container">
      <div className="admin-page-header">
        <h2>{isEditing ? 'Edit Trend' : 'Create New Trend'}</h2>
        <Link to={isEditing ? `/trends/${generatedId}` : "/admin/trends"} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Trends
        </Link>
      </div>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      {successMessage && <div className="success-message" role="status">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form" noValidate>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="Name">Name *</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              className={formErrors.Name ? 'input-error' : ''}
              aria-describedby={formErrors.Name ? 'name-error' : undefined}
              aria-invalid={!!formErrors.Name}
            />
            {formErrors.Name && <div className="error-text" id="name-error">{formErrors.Name}</div>}
          </div>
          
          {!isEditing && (
            <div className="form-group">
              <label htmlFor="GeneratedID">Internal reference * (cannot be changed later)</label>
              <input
                type="text"
                id="GeneratedID"
                name="GeneratedID"
                value={formData.GeneratedID}
                onChange={handleChange}
                required
                placeholder="Unique identifier, e.g. 'ai'"
                className={formErrors.GeneratedID ? 'input-error' : ''}
                aria-describedby={formErrors.GeneratedID ? 'generatedid-error' : 'generatedid-hint'}
                aria-invalid={!!formErrors.GeneratedID}
              />
              {formErrors.GeneratedID ? (
                <div className="error-text" id="generatedid-error">{formErrors.GeneratedID}</div>
              ) : (
                <div className="help-text" id="generatedid-hint">
                  Use lowercase letters, numbers, and hyphens only. This will be used in URLs.
                </div>
              )}
            </div>
          )}
          
          {isEditing && (
            <div className="form-group">
              <label htmlFor="GeneratedID">GeneratedID (read-only)</label>
              <input
                type="text"
                id="GeneratedID"
                value={formData.GeneratedID}
                readOnly
                disabled
                className="readonly-input"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="Abstract">Abstract</label>
            <textarea
              id="Abstract"
              name="Abstract"
              value={formData.Abstract || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the trend"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Classification</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="Stage">Stage</label>
              <select
                id="Stage"
                name="Stage"
                value={formData.Stage || ''}
                onChange={handleChange}
              >
                <option value="">Select Stage</option>
                <option value="Assess">Assess</option>
                <option value="Trial">Trial</option>
                <option value="Adopt">Adopt</option>
                <option value="Hold">Hold</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label htmlFor="LabelSegment">Label Segment</label>
              <select
                id="LabelSegment"
                name="LabelSegment"
                value={formData.LabelSegment || ''}
                onChange={handleChange}
              >
                <option value="">Select Segment</option>
                <option value="Home & Lifestyle">Home & Lifestyle</option>
                <option value="Health & Longevity">Health & Longevity</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Mobility">Mobility</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="Quadrant">Quadrant</label>
              <select
                id="Quadrant"
                name="Quadrant"
                value={formData.Quadrant || ''}
                onChange={handleChange}
              >
                <option value="">Select Quadrant</option>
                <option value="0">Mobility</option>
                <option value="1">Financial Services</option>
                <option value="2">Health & Longevity</option>
                <option value="3">Home & Lifestyle</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label htmlFor="Ring">Ring</label>
              <select
                id="Ring"
                name="Ring"
                value={formData.Ring || ''}
                onChange={handleChange}
              >
                <option value="">Select Ring</option>
                <option value="0">Adopt</option>
                <option value="1">Trial</option>
                <option value="2">Assess</option>
                <option value="3">Hold</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="LabelMaturity">Label Maturity</label>
              <select
                id="LabelMaturity"
                name="LabelMaturity"
                value={formData.LabelMaturity || ''}
                onChange={handleChange}
              >
                <option value="">Select Maturity</option>
                <option value="Emerging">Emerging</option>
                <option value="Growing">Growing</option>
                <option value="Mature">Mature</option>
                <option value="Declining">Declining</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label htmlFor="RecommendedAction">Recommended Action</label>
              <select
                id="RecommendedAction"
                name="RecommendedAction"
                value={formData.RecommendedAction || ''}
                onChange={handleChange}
              >
                <option value="">Select Action</option>
                <option value="Assess">Assess</option>
                <option value="Trial">Trial</option>
                <option value="Adopt">Adopt</option>
                <option value="Hold">Hold</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Detailed Information</h3>
          
          <div className="form-group">
            <label htmlFor="DefinitionAndScope">Definition & Scope</label>
            <textarea
              id="DefinitionAndScope"
              name="DefinitionAndScope"
              value={formData.DefinitionAndScope || ''}
              onChange={handleChange}
              rows="4"
              placeholder="Detailed description and scope of the trend"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="RelevanceAndImpact">Relevance & Impact</label>
            <textarea
              id="RelevanceAndImpact"
              name="RelevanceAndImpact"
              value={formData.RelevanceAndImpact || ''}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the relevance and potential impact of this trend"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Additional Details</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="ContentSource">Content Source</label>
              <input
                type="text"
                id="ContentSource"
                name="ContentSource"
                value={formData.ContentSource || ''}
                onChange={handleChange}
                placeholder="e.g. Internal research, Gartner, etc."
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="LastReviewDate">Last Review Date</label>
              <input
                type="date"
                id="LastReviewDate"
                name="LastReviewDate"
                value={formData.LastReviewDate || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="ImageUrl">Image URL</label>
            <input
              type="url"
              id="ImageUrl"
              name="ImageUrl"
              value={formData.ImageUrl || ''}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className={formErrors.ImageUrl ? 'input-error' : ''}
              aria-describedby={formErrors.ImageUrl ? 'imageurl-error' : undefined}
              aria-invalid={!!formErrors.ImageUrl}
            />
            {formErrors.ImageUrl && <div className="error-text" id="imageurl-error">{formErrors.ImageUrl}</div>}
            
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Technology preview" 
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (isEditing ? 'Update Trend' : 'Create Trend')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrendForm;