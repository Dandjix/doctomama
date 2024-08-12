<template>
    <h1>Consultations !</h1>
    <ConsultationsCalendar 
    @consultationClick="consultationClicked" 
    @cellClicked="cellClicked"

    @eventDeleted="deleteConsultation"
    @eventDropped="eventDropped"
    :events="events"></ConsultationsCalendar>

    <ConsultationModifyDialog 
    v-model="modifyDialog" 
    :consultation="consultationModifyDialog" 
    @update="updateConsultation"
    @delete="deleteConsultation"
    ></ConsultationModifyDialog>

    <ConsultationCreateDialog
    v-model="createDialog"
    :date="dateCreateDialog"
    @create="createConsultation"
    ></ConsultationCreateDialog>

    <ConsultationModifyOverlapDialog v-model="overlapDialog"></ConsultationModifyOverlapDialog>
</template>

<script>
    import ConsultationsCalendar from '@/components/ConsultationsProvider/ConsultationsCalendar.vue';
    // import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';
    import ConsultationModifyDialog from '@/components/ConsultationsProvider/ConsultationModifyDialog.vue';
    import ConsultationCreateDialog from '@/components/ConsultationsProvider/ConsultationCreateDialog.vue';


    import ConsultationsService from '@/services/ConsultationsService';
    import consultationTypesService from '@/services/ConsultationTypesService';
    import { mapState } from 'vuex';
    import ConsultationModifyOverlapDialog from '@/components/ConsultationsProvider/ConsultationModifyOverlapDialog.vue';
    import consultationsService from '@/services/ConsultationsService';
    // import timeSlotsService from '@/services/TimeSlotsService';
    export default{
        name:"ConsultationsView",
        components:{
            ConsultationsCalendar,
            // ConsultationsTypeSelect,
            ConsultationModifyDialog,
            ConsultationCreateDialog,
            ConsultationModifyOverlapDialog
        },
        data()
        {
            return{
                events:[],

                consultationsToUpdate:[],
                consultationIdsToDelete:[],
                consultationsToCreate:[],

                // consultationType:null,

                modifyDialog:false,
                consultationModifyDialog:null,

                createDialog:false,
                dateCreateDialog:null,

                overlapDialog:false,

            }
        },
        watch:{
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

                // console.log("c : "+JSON.stringify(consultation));
                if(consultation.eventType=="consultation")
                {
                    this.consultationModifyDialog = consultation
                    this.modifyDialog = true  
                }

            },
            cellClicked(date)
            {
                // console.log("clicked at date : "+date);

                this.dateCreateDialog = date
                this.createDialog = true

                // const updatedEvent = {
                //     id:consultation.id,
                //     title:`${nom} : ${email}`,
                //     start:date,
                //     end:end,
                //     typeid:consultation.typeid,
                //     eventType:'consultation_updated',
                //     class:'consultation_updated'
                // }
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

                const updatedEvent = {
                    id:consultation.id,
                    title:`${nom} : ${email}`,
                    start:consultation.start,
                    end:end,
                    typeid:consultation.typeid,
                    eventType:'consultation_updated',
                    class:'consultation_updated'
                }

                // console.log("new event : "+JSON.stringify(newEvent));

                this.events.splice(consultationEventIndex,1)
                this.events.push(updatedEvent)

                this.consultationsToUpdate.push(consultation)
                
                this.modifyDialog = false
            },
            deleteConsultation(id)
            {
                const i = this.events.findIndex((x)=>x.id==id)
                this.events.splice(i,1)

                this.consultationIdsToDelete.push(id)

                this.modifyDialog = false
            },
            eventDropped(event)
            {
                console.log(JSON.stringify(event));
                
            },
            generateUniqueId()
            {
                var id = 1
                var idIsUnique = false
                while(!idIsUnique)
                {
                    const eventWithId = this.events.find((x)=>{
                        return x.id == id
                    })

                    idIsUnique = eventWithId == null

                    if(!idIsUnique)
                        id++
                }
                return id
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