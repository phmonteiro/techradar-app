import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Remove the global token variable
// const token = localStorage.getItem('authToken');

// Helper function to get current token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getLikeCount = async (technologyLabel) => {
  try {
    const response = await axios.get(`${API_URL}/technologies/${technologyLabel}/likes`,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserLikeStatus = async (technologyLabel) => {
  const response = await axios.get(
    `${API_URL}/technologies/${technologyLabel}/likes/status`,
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    }
  );
  return response.data.data.likeStatus;
};

export const likeTechnology = async (technologyLabel) => {
  try {
    const response = await axios.post(`${API_URL}/technologies/${technologyLabel}/likes`,
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

export const unlikeTechnology = async (technologyLabel) => {
  try {
    const response = await axios.post(`${API_URL}/technologies/${technologyLabel}/unlike`,
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


