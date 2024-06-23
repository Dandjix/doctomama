import { getSetting,setSetting } from '../models/Settings';

const SettingsService = {
  async getSetting(setting) {
    try {
        return await getSetting(setting);
    } catch (error) {
      console.error('getSetting Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },

  async setSetting(setting,value,session){
    try{
      await setSetting(setting,value,session)
      return true;
    }
    catch(e)
    {
      return false;
    }
  }
};


export default SettingsService;