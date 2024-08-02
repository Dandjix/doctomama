import {    getConsultationsByEmail,getConsultations} 
from '../models/Consultations'


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

export default consultationsService;