<template>
    <h1>Consultations !</h1>
    <ConsultationsCalendar :events="events"></ConsultationsCalendar>
    <ConsultationsTypeSelect v-model="consultationType"></ConsultationsTypeSelect>
    
</template>

<script>
    import ConsultationsCalendar from '@/components/Consultations/ConsultationsCalendar.vue';
    import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';

    import ConsultationsService from '@/services/ConsultationsService';
    import { mapState } from 'vuex';
    export default{
        name:"ConsultationsView",
        components:{
            ConsultationsCalendar,
            ConsultationsTypeSelect
        },
        data()
        {
            return{
                events:[],
                consultationType:null
            }
        },
        watch:{
            async consultationType(newValue){
                console.log("new value for consultation Type : "+JSON.stringify(newValue));
                var timeSlots;
                // console.log("type : "+!(newValue instanceof Object));
                if(!newValue || !(newValue instanceof Object)){
                    timeSlots = []
                    let newEvents = []
                    // console.log(JSON.stringify(timeSlots));
                    // console.log(JSON.stringify(this.events));
                    for (let i = 0; i < this.events.length; i++) {
                        const event = this.events[i];
                        if(event.eventType=="consultation")
                        {
                            newEvents.push(event)
                        }
                    }
                    this.events = newEvents.concat(timeSlots)
                    return
                }
                // console.log("id : "+newValue.id);
                timeSlots = await ConsultationsService.getTimeSlots(newValue.value)
                let newEvents = []
                // console.log(JSON.stringify(timeSlots));
                // console.log(JSON.stringify(this.events));
                for (let i = 0; i < this.events.length; i++) {
                    const event = this.events[i];
                    if(event.eventType=="consultation")
                    {
                        newEvents.push(event)
                    }
                }

                this.events = newEvents.concat(timeSlots)
            }
        },
        computed:
        {
            ...mapState(['session'])
        },
        async mounted()
        {
           const consults = await ConsultationsService.getAllConsultations(this.session)

           this.events = consults

            //    console.log("consults : "+JSON.stringify(consults));
        //     this.events = consults

        //     const fin = new Date()
        //     fin.setHours(fin.getHours()+2)

        //     this.events = [
        //         {id:1,
        //         title:"consult 1 : lorent.dech@outlook.com",
        //         start:new Date(),
        //         end:fin,
        //         eventType:"consultation",
        //         class:"consultation"}]
        }

    }
</script>