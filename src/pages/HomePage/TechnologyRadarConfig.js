import { useState, useEffect } from 'react';
import axios from 'axios';

export const getTechnologyRadarConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/technology-radar-config`);
        setConfig(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load technology radar configuration');
        console.error('Error fetching technology radar config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
