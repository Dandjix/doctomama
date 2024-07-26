import axios from "axios";
import BASE_URL from "./BASE_URL";

const getVacations = async (session)=>
{
    const vacations = await axios.get(`${BASE_URL}/vacations?session=${session}`)
    return vacations.data
}

const setVacations = async (session,vacations) =>
{
    await axios.post(`${BASE_URL}/vacations?session=${session}`,vacations)
}

export {
    getVacations,
    setVacations
}