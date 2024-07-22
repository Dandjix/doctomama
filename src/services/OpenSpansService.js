import {getOpenSpans,setOpenSpans} from '../models/OpenSpans'

const openSpansService = {

    async getSpans(session)
    {
        try{
            return await getOpenSpans(session)
        }
        catch(error){
            console.error("error getting spans : "+error)
            throw error
        }
    },

    async setSpans(session,start,end,spans)
    {
        try{
            await setOpenSpans(session,start,end,spans)
            return true
        }
        catch(error)
        {
            console.error("error setting spans : "+error)
            return false
        }
    }
}

export default openSpansService;