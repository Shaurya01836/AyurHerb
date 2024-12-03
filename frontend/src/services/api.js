import axios from 'axios';

export const fetchPlants = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL, {
      headers: {
        'EnvironmentID': import.meta.env.VITE_ENVIRONMENT_ID,
        'ProjectID': import.meta.env.VITE_PROJECT_ID,
      },
      params: {
        limit: 13,
        offset: 0,
      },
    });
    return response.data; // Adjust this based on the structure of your API response
  } catch (error) {
    console.error('Error fetching plant data:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};
