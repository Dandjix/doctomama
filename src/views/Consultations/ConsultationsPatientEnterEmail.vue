<template>
    <v-sheet width="400" class="mx-auto mt-5">
        <v-form ref="form" @submit.prevent="submit">

            <v-text-field label="Email" v-model="email" :rules="rulesEmail"></v-text-field>

            <v-btn block color="primary" type="submit">Charger</v-btn>

        </v-form>
    </v-sheet>


</template>

<script>
    import WhitelistService from '@/services/WhitelistService';
import { mapActions, mapGetters } from 'vuex';

    export default{
        name:"ConsultationsPatientEnterEmail",
        computed:{
            ...mapGetters(['email_patient'])
        },
        mounted(){
            const email = this.email_patient
            // console.log("email : "+email);
            this.email = email 
        },
        data()
        {
            return{
                email:'',
                rulesEmail:[
                    email =>{
                        if(!email)
                            return 'un email est requis'
                        return true
                    },
                    email =>{
                        // const emailRegex = /^[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF@.-]+$/;
                        const emailRegex = /^[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF._%+-]+@[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF.-]+\.[a-zA-Z\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]{2,}$/;
        
                        // Check if email matches the regular expression
                        const isValid = emailRegex.test(email);
                        // console.log("in rules. Valid ? "+isValid);
                        if(isValid) return true
                        return 'email invalide'
                    },
                    async email =>{
                        const whitelisted = await WhitelistService.check(email)
                        if(whitelisted) return true
                        return "cet email n'a pas été authorisé"
                    }
                ],
            }
        },
        methods:{
            ...mapActions(['setPatientEmail']),
            async submit()
            {  
                const res = await this.$refs.form.validate()
                // console.log(JSON.stringify(res));

                const isValid = res.valid;
                
                if(!isValid){
                    // console.log("form invalide");
                    return
                }

                this.setPatientEmail(this.email)

                this.$router.push("/ConsultationsPatient")
            }
        },
        components:{

        },
        watch:{
            // email_patient(newValue)
            // {
            //     console.log("new Value for email patient : "+newValue+", store : "+this.email_patient);
                
            // }
        }

    }
</script>