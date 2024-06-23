import axios from 'axios';
import BASE_URL from './BASE_URL'

const getSetting = async (setting)=>
{
    try {
        const response = await axios.get(`${BASE_URL}/settings?setting=${setting}`);
        return response.data;
      } catch (error) {
        console.error("getSetting error:", error.response || error); // Log the error
        throw new Error('Error getting setting');
      }
}

const setSetting = async (setting,value,session)=>
    {
        try {
            await axios.post(`${BASE_URL}/settings?setting=${setting}&value=${value}&session=${session}`);
            return;
          } catch (error) {
            console.error("setSetting error:", error.response || error); // Log the error
            throw new Error('Error setting setting');
          }
    }

export
{
    getSetting,
    setSetting,
}