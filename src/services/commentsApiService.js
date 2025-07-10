// Comments API Methods
export const getComments = async () => {
  try {
    const response = await fetch(`${API_URL}/api/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateCommentApproval = async (id, isApproved) => {
  try {
    const response = await fetch(`${API_URL}/api/comments/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isApproved }),
    });
    if (!response.ok) throw new Error('Failed to update comment approval');
    return await response.json();
  } catch (error) {
    console.error('Error updating comment approval:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/comments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// References API Methods
export const getReferences = async () => {
  try {
    const response = await fetch(`${API_URL}/api/references`);
    if (!response.ok) throw new Error('Failed to fetch references');
    return await response.json();
  } catch (error) {
    console.error('Error fetching references:', error);
    throw error;
  }
};

export const createReference = async (referenceData) => {
  try {
    const response = await fetch(`${API_URL}/api/references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referenceData),
    });
    if (!response.ok) throw new Error('Failed to create reference');
    return await response.json();
  } catch (error) {
    console.error('Error creating reference:', error);
    throw error;
  }
};

export const updateReference = async (id, referenceData) => {
  try {
    const response = await fetch(`${API_URL}/api/references/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referenceData),
    });
    if (!response.ok) throw new Error('Failed to update reference');
    return await response.json();
  } catch (error) {
    console.error('Error updating reference:', error);
    throw error;
  }
};

export const deleteReference = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/references/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete reference');
    return true;
  } catch (error) {
    console.error('Error deleting reference:', error);
    throw error;
  }
};
