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

    async setSpans(session,start,end,events)
    {
        const spans = toSpans(events)
        // console.log("spans (in set spans) : "+JSON.stringify(spans));
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

function toSpans(events)
{
    var spans = []
    for (let i = 0; i < events.length; i++) {
        const span = events[i];

        const start = span.start
        // start.setUTCMonth(start.getUTCMonth()+1)
        const end = span.end
        // end.setUTCMonth(end.getUTCMonth()+1)

        // console.log("span : "+JSON.stringify(span));
        spans.push({
            debut: start,
            fin: end
        })
    }
    return spans
}

// function formatDate(date)
// {
//     return `${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth())}-${zeroPad(date.getUTCDate())}`
// }

// function zeroPad(value) {
//     return value.toString().padStart(2, '0');
// }

export default openSpansService;