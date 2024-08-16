import {getPlagesHoraires,setPlagesHoraires} from '../models/WeekPlanning'
import { setOpenSpans } from '@/models/OpenSpans';

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

  async getPlagesHorairesRaw(session) {
    // console.log("session : "+session);
    try {
        const plages = await getPlagesHoraires(session);

        return plages
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
  },

  async applyPatern(session,start,end){
    const plagesPlanning = await getPlagesHoraires(session)
    const startDate = new Date(start)
    const endDate = new Date(end)

    let workingDate = new Date(startDate)

    let spans = []

    // console.log("end date : "+JSON.stringify(endDate));

    // console.log("applying patern. plagesPlanning : "+JSON.stringify(plagesPlanning));

    while(workingDate.getTime()<=endDate.getTime())
    {
      var dayOfWeek = (workingDate.getDay()-1)%7 //0 for monday, 6 for sunday
      if(dayOfWeek<0)
        dayOfWeek+=7

      // console.log("day of week : "+dayOfWeek);

      const plagesForDate = plagesPlanning.filter(plage => 
        {
          // console.log("plage : "+JSON.stringify(plage));
          // console.log("plage.jour_semaine : "+plage.jour_semaine);
          return plage.jour_semaine_id == dayOfWeek
        })

      // console.log("plagesForDate : "+JSON.stringify(plagesForDate));

      for (let i = 0; i < plagesForDate.length; i++) {
        const plage = plagesForDate[i];
        const startDate = new Date(workingDate);
        const endDate = new Date(workingDate);
        const [startH, startM] = plage.heure_debut.split(":");
        const [endH, endM] = plage.heure_fin.split(":");
      
        startDate.setHours(startH, startM, 0, 0);
        endDate.setHours(endH, endM, 0, 0);
      
        // Adjust for local time zone offset
        const timezoneOffset = startDate.getTimezoneOffset() * 60000; // in milliseconds
      
        const span = {
          debut: new Date(startDate.getTime() - timezoneOffset),
          fin: new Date(endDate.getTime() - timezoneOffset)
        };
      
        // console.log("for " + workingDate + " : " + JSON.stringify(span));
      
        spans.push(span);
      }
      workingDate.setDate(workingDate.getDate()+1)
    }

    // console.log("spans : "+JSON.stringify(spans));

    await setOpenSpans(session,start,end,spans)
    // await apply(session,start,end)
  }
};


function createOriginalDate(dayIndex,time)
{
    const [hour,min] = time.split(":")
    let date = new Date(1970,0,5+dayIndex,hour,min,0,0)
    return date
}

function toPlages(events)
{
    // console.log(JSON.stringify(events));
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
  // console.log("plages : "+JSON.stringify(plages));
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