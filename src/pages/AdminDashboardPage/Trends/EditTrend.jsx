import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EditTrend = () => {
  const { label } = useParams();
  const navigate = useNavigate();
  const [trend, setTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/trends/${label}`,
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
        
        setTrend(techData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trend:', error);
        setError('Failed to load trend data');
        setIsLoading(false);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchTrend();
  }, [label, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!trend) {
    return <div>Trend not found</div>;
  }

  return (
    <div>
      <h1>Edit Trend</h1>
      {/* Add your edit form here */}
      <pre>{JSON.stringify(trend, null, 2)}</pre>
    </div>
  );
};

export default EditTrend;