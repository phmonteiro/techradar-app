// Service for fetching ratings from the new API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchRatingsForItem = async (itemType, generatedId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ratings/${itemType}/${generatedId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API data to match the existing rating format
    return data.data.map(rating => ({
      key: rating.RatingKey,
      displayName: rating.DisplayName,
      category: rating.Category,
      value: rating.RatingValue,
      maxValue: rating.MaxValue,
      label: rating.RatingLabel,
      scaleLabels: JSON.parse(rating.ScaleLabels || '[]'),
      icon: rating.Icon
    }));
    
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

// Create ratings from API data (replaces the existing config-based approach)
export const createRatingsFromAPI = async (itemType, generatedId) => {
  try {
    const ratings = await fetchRatingsForItem(itemType, generatedId);
    return ratings.filter(rating => rating.value !== undefined && rating.value !== null);
  } catch (error) {
    console.error('Error creating ratings from API:', error);
    // Return empty array on error to gracefully handle failures
    return [];
  }
};