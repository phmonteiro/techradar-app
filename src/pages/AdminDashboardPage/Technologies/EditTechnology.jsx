import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditTechnology = () => {
  const { label } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/technologies/${label}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Format dates if they exist
        const techData = response.data;
        if (techData.LastReviewDate) {
          techData.LastReviewDate = new Date(techData.LastReviewDate).toISOString().split('T')[0];
        }
        if (techData.CreatedAt) {
          techData.CreatedAt = new Date(techData.CreatedAt).toISOString();
        }
        
        setTechnology(techData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching technology:', error);
        setError('Failed to load technology data');
        setIsLoading(false);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchTechnology();
  }, [label, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!technology) {
    return <div>Technology not found</div>;
  }

  return (
    <div>
      <h1>Edit Technology</h1>
      {/* Add your edit form here */}
      <pre>{JSON.stringify(technology, null, 2)}</pre>
    </div>
  );
};

export default EditTechnology;