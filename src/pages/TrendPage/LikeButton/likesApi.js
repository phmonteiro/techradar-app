import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const likeTrend = async (trendLabel) => {
  try {
    const response = await axios.post(`${API_URL}/trends/${trendLabel}/likes`,
      {},
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unlikeTrend = async (trendLabel) => {
  try {
    const response = await axios.post(`${API_URL}/trends/${trendLabel}/unlike`,
      {},
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


