import {getItems,getNbPages} from '../models/Whitelist'

const WhitelistService = {
  async getItems(session,page,patern) {
    // console.log("session : "+session);
    try {
        const items = await getItems(session,page,patern);

        return items
    } catch (error) {
      console.error('whitelist service Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },
  async getNbPages(session,patern)
  {
    try {
        const nbPages = await getNbPages(session,patern);

        return nbPages
    } catch (error) {
      console.error('whitelist service Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }
};
export default WhitelistService;