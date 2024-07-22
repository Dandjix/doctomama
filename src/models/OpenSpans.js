import axios from 'axios';
import BASE_URL from './BASE_URL'

const getOpenSpans = async (session) => {
    try {
        // console.log("about to get ..");
        const response = await axios.get(`${BASE_URL}/openSpans?session=${session}`);
        // console.log("data : "+response.data);
        return response.data;
    } catch (error) {
        throw Error('Error getting open spans');
    }
};

const setOpenSpans = async (session,start,end,plages) => {
    try {
        if(start instanceof Date){
            start = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`
        }
        if(end instanceof Date){
            end = `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`
        }

        // console.log(`start : ${start} end : ${end}, plages: ${JSON.stringify(plages)}`);
        await axios.post(`${BASE_URL}/openSpans?session=${session}&start=${start}&end=${end}`,plages);
        return;
    } catch (error) {
        throw Error('Error setting open spans');
    }
};

export
{
    getOpenSpans,
    setOpenSpans
}