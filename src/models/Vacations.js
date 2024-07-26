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

const removeVacations = async (session,vacations) =>
{
    // console.log("removing vacations : "+JSON.stringify(vacations));
    await axios.delete(`${BASE_URL}/vacations?session=${session}`,{
        data: vacations
    })
}

const addVacations = async (session,vacations) =>
{
    await axios.post(`${BASE_URL}/vacations/add?session=${session}`,vacations)
}
export {
    getVacations,
    setVacations,
    removeVacations,
    addVacations,
}