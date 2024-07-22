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

const getNbPages = async (session,patern) => {
    try {
        const res = await axios.get(`${BASE_URL}/whitelist/nbPages?session=${session}&patern=${patern}`);
        return res.data;
    } catch (error) {
        throw Error('Error getting whitelist nb pages');
    }
};

export
{
    getItems,
    getNbPages
}