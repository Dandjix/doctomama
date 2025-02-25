import {addItem,deleteItem, getItems,getNbPages,check, getAllItems} from '../models/Whitelist'

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
  async getAllItems(session,patern) {
    try {
      const items = await getAllItems(session,patern);

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
  },
  async addItem(session,email)
  {
    try{
      await addItem(session,email)
    }
    catch(error){
      console.error('whitelist service Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },
  async deleteItem(session,email)
  {
    try{
      await deleteItem(session,email)
    }
    catch(error){
      console.error('whitelist service Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },
  async check(email)
  {
    try{
      // console.log("wl : "+await check(email));
      const wl = await check(email)
      // console.log("wl : "+wl);
      
      return wl
    }
    catch(error){
      console.error('whitelist service Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },
};
export default WhitelistService;