<template>
    <v-dialog v-model="visible" persistent>
        <v-card width="700" class="mx-auto my-auto">
            <v-card-title v-if="consult">Annuler {{ consult.nom }} le {{ formatTime }}</v-card-title>


            <v-card-text>
                Un code a été envoyé à votre adresse email : {{ email }}. Copiez le ici pour annuler votre rendez-vous.
            </v-card-text>

            <v-otp-input length="6" v-model="code" :loading="loading"></v-otp-input>



            <v-card-text>
                (Ceci est nécessaire afin que seulement vous puissiez annuler vos rendez-vous)
            </v-card-text>


            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="8">
                    <v-progress-linear color="primary" v-if="cooldown>0" :model-value="(cooldown*100)/cooldown_max"></v-progress-linear>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>

            <v-row>
                <v-spacer></v-spacer>
                <v-btn color="primary" width="200" @click="resend" :disabled="loading||cooldown>0">Renvoyer</v-btn>
                <v-spacer></v-spacer>
            </v-row>



            <v-row>
                <v-spacer></v-spacer>
                <v-progress-circular indeterminate v-if="loading" :model-value="cooldown"></v-progress-circular>
                <v-spacer></v-spacer>
            </v-row>


            <v-card-actions>
                <v-btn color="error" @click="cancel" :disabled="loading">Revenir en arrière</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
    import { formatTime } from '@/utils/date'; 

    export default{
        name:'ConsultationCancelDialog',
        props:{
            modelValue:{
                type:Boolean,
                required:true
            },
            OTPCode:{
                type:String,
                default:''
            },
            email:{
                type:String,
                required:true
            },
            loading:{
                type:Boolean,
                required:true
            },
            consult:{
                type:Object,
                default:null
            }
        },
        data(){
            return{
                visible:this.modelValue,
                code:'',
                cooldown_max : 21,
                cooldown : 0
            }
        },
        emits:['resend','cancel'],
        methods:{
            startCooldown() {
                //justiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiice
                this.cooldown = this.cooldown_max;
                this.cooldownInterval = setInterval(() => {
                    // console.log("cooldown : "+this.cooldown);
                    
                    if (this.cooldown > 0) {
                        this.cooldown -= 1;
                    } else {
                        clearInterval(this.cooldownInterval);
                    }
                }, 1000); // Decrease cooldown every 1 second
            },
            resend()
            {
                this.$emit('resend')
                // this.startCooldown()
            },
            cancel()
            {
                this.$emit('cancel')
            }
        },
        watch:{
            visible(newValue)
            {
                this.$emit('update:modelValue',newValue)
                // if(newValue)
                //     this.startCooldown()
            },
            modelValue(newValue) 
            {
                this.visible = newValue;
            },
            code(newValue)
            {
                this.$emit('update:OTPCode',newValue)
            },
            OTPCode(newValue) 
            {
                this.code = newValue;
            }
        },
        computed:{
            formatedTime()
            {
                if(this.consult==null)
                    return ""
                return formatTime(this.consult.debut,this.consult.duree_minutes)
            }
        }
    }
</script>