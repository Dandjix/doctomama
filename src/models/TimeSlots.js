import axios from 'axios'
import BASE_URL from './BASE_URL'

const getTimeSlots = async (idTypeConsult) =>
{
    // console.log("dans getConsultations");
    const {data} = await axios.get(`${BASE_URL}/timeSlots/${idTypeConsult}`)
    // console.log("rows : "+JSON.stringify(data));
    return data
}

const getTimeSlotsInRange = async (idTypeConsult,start,end) =>
{
    // console.log("dans getConsultations");

    start = convertDateToDate(start)
    end = convertDateToDate(end)

    const {data} = await axios.get(`${BASE_URL}/timeSlots/range/${idTypeConsult}?start=${start}&end=${end}`)
    // console.log("rows : "+JSON.stringify(data));
    return data
}

function convertDateToDate(date)
{
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return `${year}-${zeroPad(month)}-${zeroPad(day)}`
}

function zeroPad(value)
{
    return value.padStart(2,'0')
}

export{
    getTimeSlots,
    getTimeSlotsInRange
}