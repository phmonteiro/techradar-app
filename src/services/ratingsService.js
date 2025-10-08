// Service for handling ratings API calls
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get average ratings for display (public - no auth required)
 * @param {string} itemType - 'technology' or 'trend'  
 * @param {string} generatedId - The item's generated ID
 */
export const getAverageRatingsForItem = async (itemType, generatedId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ratings/average/${itemType}/${generatedId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch average ratings: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching average ratings:', error);
    throw error;
  }
};

/**
 * Get user-specific ratings for modal (requires auth)
 * @param {string} itemType - 'technology' or 'trend'
 * @param {string} generatedId - The item's generated ID
 * @param {string} token - Auth token
 */
export const getUserRatingsForItem = async (itemType, generatedId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ratings/user/${itemType}/${generatedId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user ratings: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    throw error;
  }
};

/**
 * Update user ratings
 * @param {string} itemType - 'technology' or 'trend'
 * @param {string} generatedId - The item's generated ID
 * @param {Array} ratings - Array of rating objects
 * @param {string} token - Auth token
 */
export const updateUserRatings = async (itemType, generatedId, ratings, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ratings/${itemType}/${generatedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ratings })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update ratings: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating ratings:', error);
    throw error;
  }
};

/**
 * Transform API rating data to component format
 * @param {Array} apiRatings - Ratings from API
 */
export const transformApiRatings = (apiRatings) => {
  return apiRatings.map(rating => ({
    key: rating.RatingKey,
    displayName: rating.DisplayName,
    category: rating.Category,
    value: rating.RatingValue,
    maxValue: rating.MaxValue,
    label: rating.RatingLabel,
    scaleLabels: JSON.parse(rating.ScaleLabels || '[]'),
    icon: rating.Icon,
    ratingCount: rating.RatingCount || 0
  }));
};