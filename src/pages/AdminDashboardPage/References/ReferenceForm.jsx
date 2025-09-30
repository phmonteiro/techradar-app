import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/index.css';

const FORM_MODES = {
  EDIT: 'edit',        // When id is present
  ADD_TO_ITEM: 'add',  // When type and generatedId are present
  CREATE_NEW: 'new'    // When nothing is present
};

const ReferenceForm = () => {
  const { id, type, generatedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(type || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [trends, setTrends] = useState([]);
  const types = [{type:'Technology'}, {type:'Trend'}]

    // Determine form mode
  const formMode = id ? FORM_MODES.EDIT 
    : (type && label) ? FORM_MODES.ADD_TO_ITEM 
    : FORM_MODES.CREATE_NEW;

  // Set initial form state based on params
  const [form, setForm] = useState({
    Type: selectedType || '',
    Label: label || '',
    Title: '',
    Url: '',
    Source: '',
    PublicationDate: ''
  });

  // Capitalize type for display, fallback to 'Type' if not present
  const capitalizedType = selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : 'Must select a type';

  // Fetch technologies for dropdown
  useEffect(() => {
    const fetchSelectedType = async () => {
      if (selectedType){
        try {
          const token = localStorage.getItem('authToken');
          const typeUrl = selectedType.toLowerCase() === 'technology' ? 'technologies' : 'trends';
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/${typeUrl}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (selectedType === 'Technology' || selectedType === 'technology') { 
            console.log('Fetched technologies:', response.data.data);
            setTechnologies(response.data.technologies);
          } else {
            console.log('Fetched trends:', response.data.data);
            setTrends(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching technologies:', error);
          setError('Failed to load technologies. Please try again later.');
        }
      }
    };

    fetchSelectedType();
  }, [selectedType, type]);

  // If editing, fetch the reference data
  useEffect(() => {
    if (!id) return;
    const fetchReference = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('before calling API');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/references/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });       
    
        // Format the data and ensure no null values
        const data = {
          Label: response.data.data.Label || '',
          Title: response.data.data.Title || '',
          Url: response.data.data.Url || '',
          Source: response.data.data.Source || '',
          PublicationDate: response.data.data.PublicationDate ? 
            new Date(response.data.data.PublicationDate).toISOString().split('T')[0] : ''
        };
        setSelectedType(response.data.data.Type || '');

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
  }, [label, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
      // Only update selectedType when Type field changes
  if (name === 'Type') {
    setSelectedType(value.toLowerCase());
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      // Validation
      if (!form.Title || !form.Url || 
          (formMode === FORM_MODES.CREATE_NEW && (!form.Type || !form.Label))) {
        setError('Please fill all required fields');
        return;
      }
      // URL validation
      try {
        new URL(form.Url);
      } catch (e) {
        setError('Please enter a valid URL (including http:// or https://)');
        return;
      }
      const requestData = {
        ...form,
        Type: formMode === FORM_MODES.CREATE_NEW ? form.Type : type,
        Label: formMode === FORM_MODES.CREATE_NEW ? form.Label : label
      };

      switch (formMode) {
        case FORM_MODES.EDIT:
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/admin/references/${id}`, 
            requestData,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          setSuccess('Reference updated successfully!');
          break;

        case FORM_MODES.ADD_TO_ITEM:
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/references/add/${type}/${generatedId}`,
            requestData,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          setSuccess('Reference added successfully!');
          setForm({
            ...form,
            Title: '',
            Url: '',
            Source: '',
            PublicationDate: ''
          });
          break;

        case FORM_MODES.CREATE_NEW:
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/references/add`,
            requestData,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          setSuccess('Reference created successfully!');
          break;
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
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
        </div>
        <h2>
          {formMode === FORM_MODES.EDIT && 'Edit Reference'}
          {formMode === FORM_MODES.ADD_TO_ITEM && `Add Reference to ${capitalizedType}`}
          {formMode === FORM_MODES.CREATE_NEW && 'Create New Reference'}
        </h2>
        <div className="header-right">
          <Link to="/admin/references" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to References
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
      {/* Show Type selector only in CREATE_NEW mode */}
      {formMode === FORM_MODES.CREATE_NEW && (
        <div className="form-group">
          <label htmlFor="Type">Type *</label>
          <select
            id="Type"
            name="Type"
            value={form.Type}
            onChange={handleChange}
            required
          >
            <option value="">Select a type *</option>
            {types.map(typeObj => (
              <option key={typeObj.type} value={typeObj.type.toLowerCase()}>
                {typeObj.type}
              </option>
            ))}
          </select>
        </div>
      )}
        
        <div className="form-group">
          <label htmlFor="Label">{capitalizedType} *</label>
          {/* If label param is present, show a disabled input, else show a select */}
          { label || id ? (
            <input
              type="text"
              id="Label"
              name="Label"
              value={form.Label}
              disabled
              readOnly
              className="disabled-input"
            />
          ) : (
            <select
              id="Label"
              name="Label"
              value={form.Label}
              onChange={handleChange}
              required
            >
              <option value="">{selectedType ? 'Select a '+selectedType : 'No type selected!'}</option>
              {selectedType == 'trend' ? (
                trends?.length > 0 && trends?.map(trend => (
                  <option key={trend.GeneratedID} value={trend.GeneratedID}>
                    {trend.Name}
                  </option>
                ))
              ) : (
                technologies?.length > 0 && technologies?.map(tech => (
                  <option key={tech.GeneratedID} value={tech.GeneratedID}>
                    {tech.Name}
                  </option>
                ))
              )}
            </select>
          )}
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