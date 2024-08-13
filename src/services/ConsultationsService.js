import {    
    getConsultationsByEmail,
    getConsultations,
    getConsultationByEmailAndId,
    getConsultationById,
    createConsultation,

    sendCancelConsultationEmail,
    getDeletionCooldown,
    deleteConsultation,
    updateConsultations,
    } 
from '../models/Consultations'

// import { getConsultationType } from '@/models/ConsultationTypes';


const consultationsService = {
    async getAllConsultations(session)
    {
        // console.log("dans getAllConsultations");
        try{
            // return toConsultationEvents( await getConsultations(session))
            return await getConsultations(session)
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
    async updateConsultations(session,toAdd,toDelete,toUpdate)
    {
        // console.log(JSON.stringify(toAdd));
        // console.log(JSON.stringify(toDelete));
        // console.log(JSON.stringify(toUpdate));
        
        try{
            return await updateConsultations(session,toAdd,toDelete,toUpdate)
        }
        catch(e){
            console.error("could not update consultations : "+e);
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
    async getDeletionCooldown(id)
    {
        return await getDeletionCooldown(id)
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

    }
}

// function stringifyDate(date)
// {
//     var res = JSON.stringify(date)
//     res = res.substring(1,res.length-1)
//     return res
// }

// function toConsultationEvents(consultations)
// {
//     // console.log(JSON.stringify(consultations)+" : "+typeof consultations);
//     // return consultations

//     const events = consultations.map((consult)=>
//     {
//         // console.log("consult : "+JSON.stringify(consult));
        
//         const debut = new Date(consult.debut)
//         const fin = new Date(debut)
//         fin.setMinutes(fin.getMinutes()+consult.duree_minutes)
//         return {
//             id:consult.id,
//             title:`${consult.nom} : ${consult.email}`,
//             start:debut,
//             end:fin,
//             typeid:consult.typeid,
//             eventType:'consultation',
//             class:'consultation'
//         }
//     }
//     )

//     return events
// }



export default consultationsService;