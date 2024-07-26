import {getConsultationTypes,getConsultationType,addConsultationType,deleteConsultationType,updateConsultationType} 
from '@/models/ConsultationTypes'

const consultationTypesService = {
    async getConsultationTypes()
    {
        try{
            return await getConsultationTypes()
        }
        catch(error)
        {
            console.error('consultationTypesService Error:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    },
    async getConsultationType(id)
    {
        try{
            return await getConsultationType(id)
        }
        catch(error)
        {
            console.error('consultationTypesService Error:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    },
    async addConsultationType(session,name,duration_minutes)
    {
        try{
            return await addConsultationType(session,name,duration_minutes)
        }
        catch(error)
        {
            console.error('consultationTypesService Error:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    },
    async deleteConsultationType(session,id)
    {
        try{
            return await deleteConsultationType(session,id)
        }
        catch(error)
        {
            console.error('consultationTypesService Error:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    },
    async updateConsultationType(session,id,name,duration_minutes)
    {
        try{
            return await updateConsultationType(session,id,name,duration_minutes)
        }
        catch(error)
        {
            console.error('consultationTypesService Error:', error);
            throw error; // Re-throw the error to handle it in the component
        }
    }
}

export default consultationTypesService