import axios from "axios";
import BASE_URL from "./BASE_URL";

const getConsultationTypes = async () =>{
    const response = await axios.get(`${BASE_URL}/consultationTypes`)

    return response.data
}
const getConsultationType = async (id) =>{
    const response = await axios.get(`${BASE_URL}/consultationTypes/${id}`)

    return response.data
}

const addConsultationType = async (session,name,duration_minutes) =>{
    // console.log(`session=${session}&name=${name}&duration_minutes=${duration_minutes}`);
    const response = await axios.post(`${BASE_URL}/consultationTypes?session=${session}&name=${name}&duration_minutes=${duration_minutes}`)
    return response.data
}

const deleteConsultationType = async (session,id) =>{
    const response = await axios.delete(`${BASE_URL}/consultationTypes?session=${session}&id=${id}`)
    return response.data
}

const updateConsultationType = async (session,id,name,duration_minutes) =>{
    // console.log("about to update...");
    const response = await axios.put(`${BASE_URL}/consultationTypes?session=${session}&id=${id}&name=${name}&duration_minutes=${duration_minutes}`)
    // console.log("response : "+JSON.stringify(response));
    return response.data
}

export{
    getConsultationTypes,
    getConsultationType,
    addConsultationType,
    deleteConsultationType,
    updateConsultationType
}