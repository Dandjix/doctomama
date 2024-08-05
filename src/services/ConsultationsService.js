import {    
    getConsultationsByEmail,
    getConsultations,
    getConsultationByEmailAndId,
    getConsultationById,
    createConsultation,

    sendCancelConsultationEmail,
    deleteConsultation,
    
    getTimeSlots} 
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
        // try{
            return await getConsultationsByEmail(email)
        // }
        // catch(error){
        //     // console.error("error getting consultations by email : "+error);
        //     throw error
        // }
    },
    async getConsultationByEmailAndId(email,id)
    {
        // try{
            return await getConsultationByEmailAndId(email,id)
        // }
        // catch(error){
        //     // console.error("error getting consultations by email and id : "+error);
        //     throw error
        // }
    },
    async getConsultationById(session,id)
    {
        return await getConsultationById(session,id)
    },
    async createConsultation(email,telephone,consultationTypeId,start)
    {
        try{
            // console.log("start to send : "+JSON.stringify(start));
            
            return await createConsultation(email,telephone,consultationTypeId,start)
        }
        catch(e){
            console.error("could not create consultation : "+e);
            throw e
        }
    },
    async sendCancelConsultationEmail(email,consultationId)
    {
        try
        {
            console.log("email : "+email+", id : "+consultationId);
            
            return await sendCancelConsultationEmail(email,consultationId)
        }
        catch(e)
        {
            console.error("error sending email : "+e);
            throw e
        }

    },
    async cancelConsultation(email,OTPCode,id)
    {
        try{
            return await deleteConsultation(email,OTPCode,id)
        }
        catch(e)
        {
            console.error("error canceling consultation : "+e);
            throw e
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
        // console.log("consult : "+JSON.stringify(consult));
        
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