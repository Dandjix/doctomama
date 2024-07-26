import {getVacations as get,setVacations as set} from '../models/Vacations'

const vacationsService = 
{
    async getVacations(session)
    {
        const vacations = await get(session)
        return toEvents(vacations)
    },
    async setVacations(session,events)
    {
        try{
            return await set(session,toVacations(events))
        }
        catch(e)
        {
            console.error("error setting vacations : "+e);
            return false
        }
    }
}

function toVacations(events)
{
    // console.log("toVac : "+JSON.stringify(events));
    const vacations = events.map((x)=>x.start)
    // console.log("roVac b : "+JSON.stringify(vacations));
    return vacations
}

function toEvents(vacations)
{
    // console.log("toEv : "+JSON.stringify(vacations));
    const events = vacations.map(
        (x)=>
            ({
            start: x,
            end: x,
            title: 'vacances',
            content: '<i class="icon material-icons">beach_access</i>',
            class: 'leisure'
          })
    )
    // console.log("res : "+JSON.stringify(events));
    return events
}

// function zeroPad(value) {
//     return value.toString().padStart(2, '0');
// }

export default vacationsService
