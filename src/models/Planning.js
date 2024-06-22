import axios from 'axios';

const BASE_URL = '/api';

// Function to fetch planning data
const fetchPlanningData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/plage-ouverture-planning-semaine`);
    return response.data;
  } catch (error) {
    throw Error('Error fetching planning data');
  }
};

export {
  fetchPlanningData,
};