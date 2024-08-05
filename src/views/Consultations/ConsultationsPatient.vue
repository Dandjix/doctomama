<template>
    <!-- <h1>Voir mes consultations</h1> -->

    <v-row class="my-5">
        <v-col cols="0" lg="4" sm="2" class="d-flex align-center">
            <v-divider  color="secondary" thickness="3"></v-divider>
        </v-col>
        <v-col cols="12" lg="4" sm="8">
            <v-sheet>
                <v-btn to="ConsultationsPatientEmail" block color="secondary">Changer d'email ({{ email_patient }})</v-btn>
            </v-sheet>  
        </v-col>
        <v-col cols="0" lg="4" sm="2" class="d-flex align-center">
            <v-divider  color="secondary" thickness="3"></v-divider>
        </v-col>
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

    <ChangesSnackbar v-model="snackbar" :message="snackbarMessage"></ChangesSnackbar>

</template>

<script>
    import ConsultationsList from '@/components/Consultations/ConsultationsList.vue'
    import ConsultationCancelDialog from './ConsultationCancelDialog.vue';
    import ChangesSnackbar from '@/components/Utility/ChangesSnackbar.vue';

    import consultationsService from '@/services/ConsultationsService';
    import { mapGetters } from 'vuex';

    export default{
        name:'ConsultationsPatient',
        components:{
            ConsultationsList,
            ConsultationCancelDialog,
            ChangesSnackbar
        },
        data(){
            return{
                consultations:[],

                cancelDialog:false,
                dialogLoading:false,
                dialogConsult:null,
                dialogOTPCode:'',

                snackbar:false,
                snackbarMessage:''
            }
        },
        methods:{
            async startCancel(id)
            {
                this.cancelDialog = true
                this.dialogLoading = true


                const consult = await consultationsService.getConsultationByEmailAndId(this.email_patient,id)
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
                // console.log("sending email ... "+JSON.stringify(this.dialogConsult));
                try{
                    await consultationsService.sendCancelConsultationEmail(this.email_patient,this.dialogConsult.id)
                }
                catch(e)
                {
                    alert(e)
                }


                // console.log("email sent !");

                if(autonomous){
                    this.dialogLoading = false
                }
            },
            async reload()
            {
                try{
                    this.consultations = await consultationsService.getConsultationsByEmail(this.email_patient)
                }
                catch(e)
                {
                    // console.error("error getting the consults of that email : "+e);
                    this.consultations = []
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
            await this.reload()
        },

        watch:{
            async dialogOTPCode(newValue)
            {
                // console.log("newValue length : "+newValue.length);
                if(newValue.length==6)
                {
                    // console.log("checking code : "+newValue);
                    this.dialogLoading = true

                    try{
                        await consultationsService.cancelConsultation(this.email_patient,newValue)
                    }
                    catch(e){
                        // console.log("dans le catch");
                        
                        
                        this.dialogLoading = false



                        // console.log("e : "+JSON.stringify(e));

                        // console.log("status : "+e.response.status);

                        if(e.response.status==401)
                        {
                            this.snackbarMessage = "mauvais code"
                        }
                        else
                        {
                            this.snackbarMessage = "erreur lors de la soumission du code"
                        }
                        this.snackbar = true


                        this.dialogOTPCode = ""

                        return
                    }
                    // console.log("en dehors du catch");
                    await this.reload()
                    this.dialogLoading = false
                    this.cancelDialog = false

                    this.snackbarMessage = "consultation annulée"
                    this.snackbar = true
                }
            }
        }
    }
</script>