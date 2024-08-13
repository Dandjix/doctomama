<template>
    <h1>Consultations !</h1>

    <TimeStepSelector v-model="step"></TimeStepSelector>

    <ConsultationsCalendar 
    @consultationClick="consultationClicked" 
    @cellClicked="cellClicked"

    @eventDeleted="deleteConsultation"
    @eventDropped="eventDropped"
    :events="events"></ConsultationsCalendar>

    <!-- <TimeStepSelector v-model="step"></TimeStepSelector> -->

    <ConsultationModifyDialog 
    v-model="modifyDialog" 
    :consultation="consultationModifyDialog" 
    @reset="resetConsultation"
    @update="updateConsultation"
    @delete="deleteConsultation"
    ></ConsultationModifyDialog>

    <ConsultationCreateDialog
    v-model="createDialog"
    :start-date="dateCreateDialog"
    @create="createConsultation"
    ></ConsultationCreateDialog>

    <ConsultationModifyOverlapDialog v-model="overlapDialog"></ConsultationModifyOverlapDialog>

    <v-row>
        <v-col cols="12" md="6">
            <v-btn block color="yellow-darken-4" :disabled="!modified()" @click="reset">Réinitialiser</v-btn>
        </v-col>
        <v-col cols="12" md="6">
            <v-btn block color="primary" :disabled="!modified()" @click="save">Sauvegarder</v-btn>
        </v-col>
    </v-row>
    <!-- <h1>debug</h1>

    {{ consultationsToCreate }}

    <br>

    {{ consultationIdsToDelete }}

    <br>

    {{ consultationsToUpdate }} -->


</template>

<script>
    import ConsultationsCalendar from '@/components/ConsultationsProvider/ConsultationsCalendar.vue';
    // import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';
    import ConsultationModifyDialog from '@/components/ConsultationsProvider/ConsultationModifyDialog.vue';
    import ConsultationCreateDialog from '@/components/ConsultationsProvider/ConsultationCreateDialog.vue';
    import TimeStepSelector from '@/components/Utility/TimeStepSelector.vue';

    import ConsultationsService from '@/services/ConsultationsService';
    import consultationTypesService from '@/services/ConsultationTypesService';
    import { mapState } from 'vuex';
    import ConsultationModifyOverlapDialog from '@/components/ConsultationsProvider/ConsultationModifyOverlapDialog.vue';
import consultationsService from '@/services/ConsultationsService';
import vacationsService from '@/services/VacationsService';
    // import consultationsService from '@/services/ConsultationsService';

    // import timeSlotsService from '@/services/TimeSlotsService';
    export default{
        name:"ConsultationsView",
        components:{
            ConsultationsCalendar,

            TimeStepSelector,

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
                vacations:[],

                // consultationType:null,

                modifyDialog:false,
                consultationModifyDialog:null,
                step:1,

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
            await this.reset()
        },
        methods:{
            modified(){
                const modified = this.consultationsToCreate.length>0 || this.consultationsToUpdate.length>0 ||this.consultationIdsToDelete.length>0
                return modified
            },
            async reset()
            {
                const consults = toConsultationEvents( await ConsultationsService.getAllConsultations(this.session))

                const vacations = await vacationsService.getVacationsRaw(this.session)
                const vacationsEvents = toVacationEvents(vacations)
                this.vacations = vacations


                this.events = consults
                this.events.push(...vacationsEvents)

                // console.log("events : "+JSON.stringify(this.events));
                
                // this.events.push(...vacations)
                this.consultationIdsToDelete = []
                this.consultationsToCreate = []
                this.consultationsToUpdate = []
            },
            async save()
            {
                // console.log("c : "+JSON.stringify(this.consultationsToCreate));
                // console.log("d : "+JSON.stringify(this.consultationIdsToDelete));
                // console.log("u : "+JSON.stringify(this.consultationsToUpdate));

                await consultationsService.updateConsultations(this.session,
                this.consultationsToCreate, this.consultationIdsToDelete,this.consultationsToUpdate)

                await this.reset()
            },
            async consultationClicked(id)
            {
                const consultation = this.events.find((x)=>{return x.id == id}) 

                // console.log("cons : "+JSON.stringify(consultation));
                

                // console.log("eentType : "+consultation.eventType);
                
                // console.log("c : "+JSON.stringify(consultation));
                if(consultation.eventType=="consultation" 
                || consultation.eventType=="consultation_updated" 
                || consultation.eventType=="consultation_new")
                {
                    this.consultationModifyDialog = consultation
                    this.modifyDialog = true  
                }

            },
            cellClicked(date)
            {
                // console.log("date : "+JSON.stringify(date));
                
                this.dateCreateDialog = date
                this.createDialog = true
            },
            async createConsultation(consultation)
            {
                // console.log("cons to create : "+JSON.stringify(consultation));
                
                const consultationType = await consultationTypesService.getConsultationType(consultation.typeid)

                const id = this.generateUniqueId()



                const end = new Date(consultation.start)

                end.setMinutes(end.getMinutes()+consultationType.duree_minutes)

                const newEvent = {
                    id:id,
                    title:`${consultationType.nom} : ${consultation.email}`,
                    email:consultation.email,
                    telephone:consultation.telephone,
                    start:consultation.start,
                    end:end,
                    typeid:consultation.typeid,
                    eventType:'consultation_new',
                    class:'consultation_new'
                }

                const consultationWithId = {...consultation,id:id}
                this.consultationsToCreate.push(consultationWithId)

                this.events.push(newEvent)

                this.createDialog = false
            },
            async resetConsultation(id)
            {
                const event = this.events.find((x)=>x.id==id)
                const consultationEventIndex = this.events.findIndex((x)=>x.id==id)

                if(event.eventType=="consultation_new")
                {
                    const consultationsToCreateIndex = this.consultationsToCreate.findIndex((x)=>x.id==id)

                    this.consultationsToCreate.splice(consultationsToCreateIndex,1)
                    this.events.splice(consultationEventIndex,1)
                }
                else if (event.eventType=="consultation")
                {
                    this.modifyDialog = false
                }
                else //if (event.eventType=="consultation_updated")
                {
                    // console.log("updated");
                    
                    const consultationsToUpdateIndex = this.consultationsToUpdate.findIndex((x)=>x.id==id)

                    this.consultationsToUpdate.splice(consultationsToUpdateIndex,1)
                    this.events.splice(consultationEventIndex,1)

                    var original = await consultationsService.getConsultationById(this.session,id)
                    original = {...original,id:id}

                    const [event] = toConsultationEvents([original])

                    this.events.push(event)
                    this.modifyDialog = false

                    // console.log("done");
                    
                }

                this.modifyDialog = false
            },
            async updateConsultation(consultation)
            {
                // console.log("updating consultation : "+JSON.stringify(consultation));
                // console.log("events : "+JSON.stringify(this.events));
                const consultationEventIndex = this.events.findIndex((x)=>{
                    return x.id == consultation.id
                })

                const {duree_minutes:duration,nom} = await consultationTypesService.getConsultationType(consultation.typeid)
                // console.log("duration : "+duration);
                
                // const {email,telephone} = await consultationsService.getConsultationById(this.session,consultation.id)

                const end = new Date(consultation.start)
                end.setMinutes(consultation.start.getMinutes()+duration)

                var eventType

                // console.log("et : "+consultation.eventType);
                

                if(consultation.eventType == 'consultation')
                {
                    // console.log("ok");
                    
                    eventType = 'consultation_updated'

                    this.consultationsToUpdate.push(consultation)
                }
                else if(consultation.eventType == 'consultation_updated')
                {
                    eventType = 'consultation_updated'

                    const index = this.consultationsToUpdate.findIndex((x)=>x.id==consultation.id)
                    this.consultationsToUpdate.splice(index,1)
                    this.consultationsToUpdate.push(consultation)
                }
                else // if consultation_new
                {
                    eventType = 'consultation_new'

                    const index = this.consultationsToCreate.findIndex((x)=>x.id==consultation.id)
                    this.consultationsToCreate.splice(index,1)
                    this.consultationsToCreate.push(consultation)
                }

                // console.log("et : "+eventType);
                

                const updatedEvent = {
                    id:consultation.id,
                    title:`${nom} : ${consultation.email}`,
                    email:consultation.email,
                    telephone:consultation.telephone,
                    start:consultation.start,
                    end:end,
                    typeid:consultation.typeid,
                    eventType:eventType,
                    class:eventType
                }

                // console.log("new event : "+JSON.stringify(newEvent));

                this.events.splice(consultationEventIndex,1)
                this.events.push(updatedEvent)


                
                this.modifyDialog = false
            },
            deleteConsultation(id)
            {
                const consultation = this.events.find((x)=>x.id==id)

                if(consultation.eventType=="consultation")
                {
                    const i = this.events.findIndex((x)=>x.id==id)
                    this.events.splice(i,1)

                    this.consultationIdsToDelete.push(id)
                }
                else if(consultation.eventType=="consultation_updated")
                {
                    const indexEvents = this.events.findIndex((x)=>x.id==id)
                    this.events.splice(indexEvents,1)

                    const indexToUpdate = this.consultationsToUpdate.findIndex((x)=>x.id==id)
                    this.consultationsToUpdate.splice(indexToUpdate,1)

                    this.consultationIdsToDelete.push(id)
                }
                else //if consultation_new
                {
                    const indexEvents = this.events.findIndex((x)=>x.id==id)
                    this.events.splice(indexEvents,1)

                    const indexToCreate = this.consultationsToCreate.findIndex((x)=>x.id==id)
                    this.consultationsToCreate.splice(indexToCreate,1)
                }


                this.modifyDialog = false
            },
            eventDropped(req)
            {
                const event = req.event

                this.applyStep(event.start)
                // console.log("event : "+JSON.stringify(event));
                this.updateConsultation(event)
                
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
            } ,
            applyStep(date)
            {
                const step = this.step
                const rawMinutes = date.getHours()*60+date.getMinutes()
                var roundedMinutes = Math.round(rawMinutes/step)*step
                const roundedHours = Math.floor(roundedMinutes/60)
                roundedMinutes = roundedMinutes % 60
                date.setHours(roundedHours,roundedMinutes)
            }
        },


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

    function toVacationEvents(vacations)
    {

        // console.log("vacations : "+JSON.stringify(vacations));
        // return []

        const events = vacations.map((vacation)=>
        {
            // const start = new Date(vacation)
            // const end = new Date(vacation)
            // end.setHours(23,59,59)
            // console.log(vacation);
            
            return {
                title: 'vacances',
                content: '<i class="icon material-icons">beach_access</i>',

                start: vacation,
                end: vacation,

                deletable: false,
                // resizable: false,
                draggable: false,

                eventType:'vacation',
                class:'vacation'
            }
        }
        )

        // const events = [
        // {
        // start: '2024-08-13',
        // end: '2024-08-13',
        // title: 'Need to go shopping',
        // content: '<i class="icon material-icons">shopping_cart</i>',
        // class: 'vacances'
        // },]
        return events
    }

</script>