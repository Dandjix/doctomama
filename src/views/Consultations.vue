<template>
    <h1>Consultations !</h1>
    <ConsultationsCalendar :events="events"></ConsultationsCalendar>
    <ConsultationsTypeSelect v-model="consultationType"></ConsultationsTypeSelect>
    
    <h1>cons type : </h1>
    {{ consultationType }}
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
        computed:
        {
            ...mapState(['session'])
        },
        async mounted()
        {
           const consults = await ConsultationsService.getAllConsultations(this.session)
               console.log("consults : "+JSON.stringify(consults));
        //     this.events = consults

            const fin = new Date()
            fin.setHours(fin.getHours()+2)

            this.events = [
                {id:1,
                title:"consult 1 : lorent.dech@outlook.com",
                start:new Date(),
                end:fin,
                eventType:"consultation",
                class:"consultation"}]
        }
    }
</script>