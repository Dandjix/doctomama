import {getPlagesHoraires,setPlagesHoraires} from '../models/WeekPlanning'

const WeekPlanningService = {
  async getPlagesHoraires(session) {
    // console.log("session : "+session);
    try {
        const plages = await getPlagesHoraires(session);

        return toEvents(plages)
    } catch (error) {
      console.error('WeekPlanningService Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },

  async setPlagesHoraires(session,events){
    try{
        const plages = toPlages(events)
        await setPlagesHoraires(session,plages)
        return;
    }
    catch(error){
        console.error('WeekPlanningService Error:', error);
        throw error; // Re-throw the error to handle it in the component
    }


  }
};
// {"start":"1970-01-07T09:05:00.000Z","end":"1970-01-07T10:05:00.000Z"}
// const origin = "1970-01-05"

// function getDayIndex(date)
// {
//     console.log(origin);
//     const day = date.getDay()
//     return day;
// }

function createOriginalDate(dayIndex,time)
{
    const [hour,min] = time.split(":")
    let date = new Date(1970,0,5+dayIndex,hour,min,0,0)
    return date
}

function toPlages(events)
{
    console.log(JSON.stringify(events));
    let plages = []
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const day = event.start.getDate() - 5
      const h_d = `${event.start.getHours()}:${event.start.getMinutes()}`
      const h_f = `${event.end.getHours()}:${event.end.getMinutes()}`
     
      let plage = 
      {
        "day":day,
        "start_time":h_d,
        "end_time":h_f
      }
      plages.push(plage)
    }
    // console.log("plages : "+JSON.stringify(plages));
    return plages
}

function toEvents(plages)
{
    let events = []
    // console.log("toEvents : "+JSON.stringify(plages));
    for (let i = 0; i < plages.length; i++) {
        const plage = plages[i];
        let event = {"start":createOriginalDate(plage.jour_semaine_id,plage.heure_debut),
            "end":createOriginalDate(plage.jour_semaine_id,plage.heure_fin)}
        events.push(event)
    }
    return events
    
}


export default WeekPlanningService;