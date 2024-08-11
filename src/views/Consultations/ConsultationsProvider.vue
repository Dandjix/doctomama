<template>
    <h1>Consultations !</h1>
    <v-row>
        <v-spacer></v-spacer>
        <v-col>
            <v-sheet width="500">
                <ConsultationsTypeSelect v-model="consultationType" clearable></ConsultationsTypeSelect>
            </v-sheet>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    <ConsultationsCalendar @consultationClick="consultationClicked" :events="events"></ConsultationsCalendar>

    <ConsultationModifyDialog v-model="modifyDialog" :consultation="consultationDialog" @update="updateConsultation"></ConsultationModifyDialog>

    <ConsultationModifyOverlapDialog v-model="overlapDialog"></ConsultationModifyOverlapDialog>
</template>

<script>
    import ConsultationsCalendar from '@/components/ConsultationsProvider/ConsultationsCalendar.vue';
    import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';
    import ConsultationModifyDialog from '@/components/ConsultationsProvider/ConsultationModifyDialog.vue';


    import ConsultationsService from '@/services/ConsultationsService';
    import consultationTypesService from '@/services/ConsultationTypesService';
    import { mapState } from 'vuex';
    import ConsultationModifyOverlapDialog from '@/components/ConsultationsProvider/ConsultationModifyOverlapDialog.vue';
    import consultationsService from '@/services/ConsultationsService';
import timeSlotsService from '@/services/TimeSlotsService';
    export default{
        name:"ConsultationsView",
        components:{
            ConsultationsCalendar,
            ConsultationsTypeSelect,
            ConsultationModifyDialog,
            ConsultationModifyOverlapDialog
        },
        data()
        {
            return{
                events:[],

                consultationsToUpdate:[],
                consultationsToDelete:[],
                consultationsToCreate:[],

                consultationType:null,

                modifyDialog:false,
                consultationDialog:null,

                overlapDialog:false,

            }
        },
        watch:{
            async consultationType(newValue){
                // console.log("new value for consultation Type : "+JSON.stringify(newValue));
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
                timeSlots = await timeSlotsService.getTimeSlots(newValue.value)
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
           const consults = toConsultationEvents( await ConsultationsService.getAllConsultations(this.session))

           this.events = consults
        },
        methods:{
            async consultationClicked(id)
            {
                // const consultation = {...(await ConsultationsService.getConsultationById(this.session,id)),id:id}
                const consultation = this.events.find((x)=>{return x.id == id}) 

                // console.log("1 : "+JSON.stringify(consultation));
                // console.log("2 : "+JSON.stringify(consultation));

                this.consultationDialog = consultation
                this.modifyDialog = true
            },
            async updateConsultation(consultation)
            {
                // console.log("updating consultation : "+JSON.stringify(consultation));
                // console.log("events : "+JSON.stringify(this.events));
                const consultationEventIndex = this.events.findIndex((x)=>{
                    return x.id == consultation.id
                })

                const {duree_minutes:duration,nom} = await consultationTypesService.getConsultationType(consultation.typeid)
                console.log("duration : "+duration);
                
                const {email} = await consultationsService.getConsultationById(this.session,consultation.id)

                const end = new Date(consultation.start)
                end.setMinutes(consultation.start.getMinutes()+duration)

                const newEvent = {
                    id:consultation.id,
                    title:`${nom} : ${email}`,
                    start:consultation.start,
                    end:end,
                    typeid:consultation.typeid,
                    eventType:'consultation',
                    class:'consultation'
                }

                // console.log("new event : "+JSON.stringify(newEvent));

                this.events.splice(consultationEventIndex,1)
                this.events.push(newEvent)

                this.consultationsToUpdate.push(consultation)
                
                this.modifyDialog = false
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
                email:consult.email,
                telephone:consult.telephone,
                start:debut,
                end:fin,
                typeid:consult.typeid,
                eventType:'consultation',
                class:'consultation'
            }
        }
        )

        return events
    }

</script>