import axios from 'axios';
import BASE_URL from './BASE_URL'

const getPlagesHoraires = async (session) => {
    try {
        // console.log("about to get ..");
        const response = await axios.get(`${BASE_URL}/weekPlanning?session=${session}`);
        // console.log("data : "+response.data);
        return response.data;
    } catch (error) {
        throw Error('Error getting plages horaire');
    }
};

const setPlagesHoraires = async (session,plages) => {
    try {
        await axios.post(`${BASE_URL}/weekPlanning?session=${session}`,plages);
        return;
    } catch (error) {
        throw Error('Error setting plages horaire');
    }
};

export
{
    getPlagesHoraires,
    setPlagesHoraires
}