import axios from 'axios'
import BASE_URL from './BASE_URL'

const getConsultationsByEmail = async (email) =>
{
    const {rows} = await axios.get(`${BASE_URL}/consultations/${email}`)
    return rows
}

const getConsultations = async (session) =>
{
    // console.log("dans getConsultations");
    const {data} = await axios.get(`${BASE_URL}/consultations?session=${session}`)
    // console.log("rows : "+JSON.stringify(data));
    return data
}

const getTimeSlots = async (idTypeConsult) =>
    {
        // console.log("dans getConsultations");
        const {data} = await axios.get(`${BASE_URL}/consultations/timeSlots/${idTypeConsult}`)
        // console.log("rows : "+JSON.stringify(data));
        return data
    }

export {
    getConsultationsByEmail,
    getConsultations,
    getTimeSlots
}