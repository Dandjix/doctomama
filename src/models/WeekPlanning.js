import axios from 'axios';
import BASE_URL from './BASE_URL'

const getPlagesHoraires = async (session) => {
    try {
      const response = await axios.post(`${BASE_URL}/login?hashed_password=${hashed_password}`);
      return response.data;
    } catch (error) {
      throw Error('Error logging in');
    }
  };

  export
  {
    getPlagesHoraires as login
  }