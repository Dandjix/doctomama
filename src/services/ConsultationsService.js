import {    getConsultationsByEmail,getConsultations, getTimeSlots} 
from '../models/Consultations'

import { getConsultationType } from '@/models/ConsultationTypes';


const consultationsService = {
    async getAllConsultations(session)
    {
        // console.log("dans getAllConsultations");
        try{
            return toConsultationEvents( await getConsultations(session))
        }
        catch(error){
            console.error("error getting all consultations : "+error);
            throw error
        }
    },
    async getConsultationsByEmail(email)
    {
        try{
            return await getConsultationsByEmail(email)
        }
        catch(error){
            console.error("error getting consultations by email : "+error);
            throw error
        }
    },
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
    }
}

function toConsultationEvents(consultations)
{
    // console.log(JSON.stringify(consultations)+" : "+typeof consultations);
    // return consultations

    const events = consultations.map((consult)=>
    {
        const debut = new Date(consult.debut)
        const fin = new Date(debut)
        fin.setMinutes(fin.getMinutes()+consult.duree_minutes)
        return {
            id:consult.id,
            title:`${consult.nom} : ${consult.email}`,
            start:debut,
            end:fin,
            eventType:'consultation',
            class:'consultation'
        }
    }
    )

    return events
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

export default consultationsService;