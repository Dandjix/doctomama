<template>
    <!-- <h1>Voir mes consultations</h1> -->

    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="4">
            <v-btn to="ConsultationsPatientEmail">Changer d'email</v-btn>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>

    <ConsultationsList :consultations="consultations" @cancel="startCancel"></ConsultationsList>
    <ConsultationCancelDialog 
    v-model="cancelDialog"
    v-model:OTPCode="dialogOTPCode"

    :email="email" 
    :loading="dialogLoading" 
    :consult="dialogConsult"
    @resend="sendEmail(true)"
    @cancel="cancelDialog = false"></ConsultationCancelDialog>
</template>

<script>
    import ConsultationsList from '@/components/Consultations/ConsultationsList.vue'
    import ConsultationCancelDialog from './ConsultationCancelDialog.vue';

    import consultationsService from '@/services/ConsultationsService';
    import { mapGetters } from 'vuex';

    export default{
        name:'ConsultationsPatient',
        components:{
            ConsultationsList,
            ConsultationCancelDialog
        },
        data(){
            return{
                email:'',
                consultations:[],

                cancelDialog:false,
                dialogLoading:false,
                dialogConsult:null,
                dialogOTPCode:''
            }
        },
        methods:{
            async startCancel(id)
            {
                this.cancelDialog = true
                this.dialogLoading = true


                const consult = await consultationsService.getConsultationByEmailAndId(this.email,id)
                this.dialogConsult = {...consult,id:id}

                // console.log("consult : "+JSON.stringify(consult))

                await this.sendEmail(false)

                this.dialogLoading = false
            },
            async sendEmail(autonomous=false)
            {
                if(autonomous){
                    this.dialogLoading = true
                }
                console.log("sending email ... "+JSON.stringify(this.dialogConsult));
                try{
                    await consultationsService.sendCancelConsultationEmail(this.email,this.dialogConsult.id)
                }
                catch(e)
                {
                    alert(e)
                }


                console.log("email sent !");

                if(autonomous){
                    this.dialogLoading = false
                }
            }
        },
        computed:{
            ...mapGetters(['email_patient'])
        },
        async mounted()
        {
            if(this.email_patient=="")
            {
                // console.log("no email loaded, redirecting to ConsultationsPatientEmail")   
                this.$router.push("ConsultationsPatientEmail")
            }
                            // console.log("email changed to : "+newValue);
            try{
                this.consultations = await consultationsService.getConsultationsByEmail(this.email_patient)
            }
            catch(e)
            {
                // console.error("error getting the consults of that email : "+e);
                this.consultations = []
            }
        },
        watch:{
            async OTPCode(newValue)
            {
                console.log("newValue length : "+newValue.length);
                
            }
        }
    }
</script>