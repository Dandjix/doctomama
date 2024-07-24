import {getOpenSpans,setOpenSpans} from '../models/OpenSpans'

const openSpansService = {

    async getSpans(session)
    {
        try{
            
            return toEvents( await  getOpenSpans(session))
            // return []
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

function toEvents(openSpans)
{
    var events = []
    for (let i = 0; i < openSpans.length; i++) {
        const span = openSpans[i];
        // console.log("span : "+JSON.stringify(span));
        events.push({
            start: new Date(span.debut),
            end: new Date(span.fin)
        })
    }
    return events
}

export default openSpansService;