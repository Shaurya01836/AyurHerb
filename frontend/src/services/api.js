import axios from 'axios';
const headers = {
  EnvironmentID: import.meta.env.VITE_ENVIRONMENT_ID,
  ProjectID: import.meta.env.VITE_PROJECT_ID,
};


// API Base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all herbs
export const fetchHerbs = async (limit = 13, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        EnvironmentID: import.meta.env.VITE_ENVIRONMENT_ID,
        ProjectID: import.meta.env.VITE_PROJECT_ID,
      },
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching herbs:', error.message);
    throw new Error('Failed to fetch herbs');
  }
};

// Create a new herb
export const createHerb = async (herbData) => {
  try {
    const response = await axios.post(`${BASE_URL}/herbs`, herbData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating herb:', error.message);
    throw new Error('Failed to create herb');
  }
};

// Update an existing herb
export const updateHerb = async (id, herbData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/herbs/${id}`, herbData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating herb:', error.message);
    throw new Error('Failed to update herb');
  }
};

// Delete an herb
export const deleteHerb = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/herbs/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting herb:', error.message);
    throw new Error('Failed to delete herb');
  }
};