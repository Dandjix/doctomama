import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Function to fetch planning data
const login = async (hashed_password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login?hashed_password=${hashed_password}`);
    return response.data;
  } catch (error) {
    throw Error('Error logging in');
  }
};

const getSalt = async () =>{
    try {
        const response = await axios.get(`${BASE_URL}/login/getSalt`);
        // console.log("response salt : "+JSON.stringify(response));
        return response.data;
      } catch (error) {
        console.error("getSalt error:", error.response || error); // Log the error
        throw new Error('Error getting salt');
      }
}

const logout = async (session) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/logout?session=${session}`);
    return response.data;
  } catch (error) {
    throw Error('Error logging out');
  }
};

export {
  login,
  getSalt,
  logout
};