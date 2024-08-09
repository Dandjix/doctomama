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

    <ConsultationModifyDialog v-model="modifyDialog" :consultation="consultationDialog"></ConsultationModifyDialog>
</template>

<script>
    import ConsultationsCalendar from '@/components/ConsultationsProvider/ConsultationsCalendar.vue';
    import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';
    import ConsultationModifyDialog from '@/components/ConsultationsProvider/ConsultationModifyDialog.vue';

    import ConsultationsService from '@/services/ConsultationsService';
    import { mapState } from 'vuex';
    export default{
        name:"ConsultationsView",
        components:{
            ConsultationsCalendar,
            ConsultationsTypeSelect,
            ConsultationModifyDialog
        },
        data()
        {
            return{
                events:[],
                consultationType:null,

                modifyDialog:false,
                consultationDialog:null
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
        },
        methods:{
            async consultationClicked(id)
            {
                const consultation = {...(await ConsultationsService.getConsultationById(this.session,id)),id:id}
                console.log("start : "+JSON.stringify(consultation));

                this.consultationDialog = consultation
                this.modifyDialog = true
            }
        }

    }
</script>