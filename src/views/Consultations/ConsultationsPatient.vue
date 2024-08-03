<template>
    <h1>Voir mes consultations</h1>
    <EmailSearch v-model="email"></EmailSearch>
    <ConsultationsList :consultations="consultations" @cancel="startCancel"></ConsultationsList>
    <ConsultationCancelDialog 
    v-model="cancelDialog" 
    :email="email" 
    :loading="dialogLoading" 
    :consult="dialogConsult"
    @resend="sendEmail"
    @cancel="cancelDialog = false"></ConsultationCancelDialog>
</template>

<script>
    import ConsultationsList from '@/components/Consultations/ConsultationsList.vue'
    import EmailSearch from '@/components/Consultations/EmailSearch.vue';
    import ConsultationCancelDialog from './ConsultationCancelDialog.vue';

    import consultationsService from '@/services/ConsultationsService';

    export default{
        name:'ConsultationsPatient',
        components:{
            ConsultationsList,
            EmailSearch,
            ConsultationCancelDialog
        },
        data(){
            return{
                email:'',
                consultations:[],

                cancelDialog:false,
                dialogLoading:false,
                dialogConsult:null
            }
        },
        methods:{
            async startCancel(id)
            {
                this.cancelDialog = true
                this.dialogLoading = true


                const consult = await consultationsService.getConsultationByEmailAndId(this.email,id)
                this.dialogConsult = consult

                console.log("consult : "+JSON.stringify(consult))

                this.dialogLoading = false
            },
            async sendEmail()
            {

            }
        },  
        watch:{
            async email(newValue)
            {
                this.consultations = await consultationsService.getConsultationsByEmail(newValue)

                // console.log("email changed to : "+newValue+" nb c : "+JSON.stringify(this.consultations));
            }
        }
    }
</script>