
import { getConsultationType } from '@/models/ConsultationTypes';

import { getTimeSlots, getTimeSlotsInRange } from '@/models/TimeSlots';

const timeSlotsService = {
    async getTimeSlots(typeConsultationId)
    {
        try{
            const ConsultationType = await getConsultationType(typeConsultationId)

            return toTimeSlotEvents(await getTimeSlots(typeConsultationId),ConsultationType)
        }
        catch(error){
            console.error("could not get time slots : "+error);
            throw error
        }
    },
    async getTimeSlotsInRange(typeConsultationId,start,end)
    {
        try{
            const ConsultationType = await getConsultationType(typeConsultationId)

            return toTimeSlotEvents(await getTimeSlotsInRange(typeConsultationId,start,end),ConsultationType)
        }
        catch(error){
            console.error("could not get time slots : "+error);
            throw error
        }
    }
}

function toTimeSlotEvents(timeSlots,consultationType)
{
    const {duree_minutes,nom} = consultationType

    // console.log("ts : "+JSON.stringify(timeSlots));
    // console.log("duration : "+duree_minutes);
    // console.log("bom : "+nom);

    const events = timeSlots.map((x)=>{
        const debut = new Date(x)
        const fin = new Date(debut)
        fin.setMinutes(debut.getMinutes()+duree_minutes)

        return{
            title:`Créneau pour ${nom}`,
            start:debut,
            end:fin,
            class:"timeSlot",
            eventType:"timeSlot"
        }
    })

    // console.log("events : "+JSON.stringify(events));

    return events
}

export default timeSlotsService