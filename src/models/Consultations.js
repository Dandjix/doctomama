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

const getConsultationById = async (session,id) =>
{
    const {data} = await axios.get(`${BASE_URL}/consultations/oneById?session=${session}&id=${id}`)
    return data
}



const createConsultation = async (email,telephone,consultationTypeId,start) =>
{
    // console.log("start b (c): "+start);

    start = convertDateToTime(start)

    // console.log("start a (c) : "+start);
    

    // console.log("start conv : "+start);
    
    const url = `${BASE_URL}/consultations?email=${email}&telephone=${telephone}&consultationTypeId=${consultationTypeId}&start=${start}`
    console.log("url : "+url);
    
    await axios.post(url)
}

const updateConsultations = async (session,toAdd,toDelete,toUpdate) =>{

    // console.log("before"+JSON.stringify(toAdd));
    // console.log("toAdd: "+JSON.stringify(toAdd));
    for (let i = 0; i < toAdd.length; i++) {
        const element = toAdd[i];
        element.start = convertDateToTime(element.start)
        
    }
    for (let i = 0; i < toUpdate.length; i++) {
        const element = toUpdate[i];
        element.start = convertDateToTime(element.start)
        
    }
    // console.log("after : "+JSON.stringify(toAdd));

    const body = {
        "toAdd":toAdd,
    
        "toDelete":toDelete,
    
        "toUpdate":toUpdate
    }
    const url = `${BASE_URL}/consultations/update?session=${session}`
    await axios.post(url,body)
}

const sendCancelConsultationEmail = async (email,consultationId) =>
{
    // http://localhost:3000/consultations/cancel?email=timondubreuil@outlook.com&id=1

    // console.log("sendCancelConsultationEmail : "+email+", "+consultationId);
    

    const url = `${BASE_URL}/consultations/cancel?email=${email}&id=${consultationId}`
    
    await axios.post(url)

    // console.log("res sendCancelConsultationEmail : "+JSON.stringify(res));
}

const getDeletionCooldown = async (id) =>
{
    const url = `${BASE_URL}/consultations/deletionCooldown?id=${id}`

    const response = await axios.get(url)

    return response.data
}

const deleteConsultation = async (email,OTPCode,id) =>
{
    const url = `${BASE_URL}/consultations?email=${email}&OTPCode=${OTPCode}&consultId=${id}`
    
    await axios.delete(url)

    // console.log("res deleteConsultation : "+JSON.stringify(res));
}

function convertDateToTime(date)
{
    var res = JSON.stringify(date)
    res = res.substring(1,res.length-1)
    // TODO : make the code above not suck ass


    return res

}



export {
    getConsultationsByEmail,
    getConsultations,
    getConsultationByEmailAndId,
    getConsultationById,

    createConsultation,
    updateConsultations,

    sendCancelConsultationEmail,
    getDeletionCooldown,
    deleteConsultation,

    // getTimeSlots,
    // getTimeSlotsInRange
}