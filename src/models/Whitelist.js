import axios from 'axios';
import BASE_URL from './BASE_URL'

const getItems = async (session,page,patern) => {
    try {
        // console.log("about to get ..");
        const response = await axios.get(`${BASE_URL}/whitelist?session=${session}&page=${page}&patern=${patern}`);
        // console.log("data : "+response.data);
        return response.data;
    } catch (error) {
        throw Error('Error getting whitelist items');
    }
};

const getAllItems = async (session,patern) => {
    try {
        // console.log("about to get ..");
        const response = await axios.get(`${BASE_URL}/whitelist/all?session=${session}&patern=${patern}`);
        // console.log("data : "+response.data);
        return response.data;
    } catch (error) {
        throw Error('Error getting all whitelist items');
    }
};

const getNbPages = async (session,patern) => {
    try {
        const res = await axios.get(`${BASE_URL}/whitelist/nbPages?session=${session}&patern=${patern}`);
        return res.data;
    } catch (error) {
        throw Error('Error getting whitelist nb pages');
    }
};

const addItem = async(session,email) => {
    try{
        await axios.post(`${BASE_URL}/whitelist?session=${session}&email=${email}`); 
    }
    catch(error){
        throw Error('Error while adding email to whitelist')
    }
}
const deleteItem = async(session,email) => {
    try{
        await axios.delete(`${BASE_URL}/whitelist?session=${session}&email=${email}`); 
    }
    catch(error){
        throw Error('Error while adding email to whitelist')
    }
}

const check = async(email) => {
    try{
        const res = await axios.get(`${BASE_URL}/whitelist/check?email=${email}`); 
        // console.log("res : "+JSON.stringify(res));
        return res.data
        
    }
    catch(error){
        throw Error('Error while checking if email in whitelist')
    }
}

export
{
    getItems,
    getAllItems,
    getNbPages,
    addItem,
    deleteItem,
    check
}