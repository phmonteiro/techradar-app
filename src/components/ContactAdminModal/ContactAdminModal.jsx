import React, { useState } from 'react';
import './ContactAdminModal.css';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ContactAdminModal = ({ isOpen, onClose, label, type }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  const token = localStorage.getItem('authToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        '${import.meta.env.VITE_API_URL}/api/contact-admin',
        {
          email: currentUser.email,
          subject: `${subject} | ${type.charAt(0).toUpperCase() + type.slice(1)} | ${label}`,
          text: message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setSubject('');
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Contact Admin</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Message sent successfully!</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isSubmitting}
              rows="5"
            />
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactAdminModal; 