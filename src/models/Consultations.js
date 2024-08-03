import axios from 'axios'
import BASE_URL from './BASE_URL'

const getConsultationsByEmail = async (email) =>
{
    const {data} = await axios.get(`${BASE_URL}/consultations/${email}`)
    return data
}

const getConsultations = async (session) =>
{
    // console.log("dans getConsultations");
    const {data} = await axios.get(`${BASE_URL}/consultations?session=${session}`)
    // console.log("rows : "+JSON.stringify(data));
    return data
}

const getConsultationByEmailAndId = async (email,id) =>
{
    const {data} = await axios.get(`${BASE_URL}/consultations/one?email=${email}&id=${id}`)
    return data
}

const getTimeSlots = async (idTypeConsult) =>
{
    // console.log("dans getConsultations");
    const {data} = await axios.get(`${BASE_URL}/consultations/timeSlots/${idTypeConsult}`)
    // console.log("rows : "+JSON.stringify(data));
    return data
}

const createConsultation = async (email,telephone,consultationTypeId,start) =>
{
    // console.log("start : "+JSON.stringify(start));
    start = JSON.stringify(start)
    start = start.substring(1,start.length-1)
    // TODO : make the code above not suck ass
    // console.log("start conv : "+start);
    
    const url = `${BASE_URL}/consultations?email=${email}&telephone=${telephone}&consultationTypeId=${consultationTypeId}&start=${start}`
    console.log("url : "+url);
    
    await axios.post(url)
}

export {
    getConsultationsByEmail,
    getConsultations,
    getConsultationByEmailAndId,
    getTimeSlots,
    createConsultation
}