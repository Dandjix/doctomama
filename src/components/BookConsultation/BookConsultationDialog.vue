<template>
    <v-dialog v-model="visible" :persistent="disabled">
        <v-card :title="title">
            <v-btn
                icon="mdi-close"
                variant="text"
                @click="visible = false"
                class="close-btn"
                :disabled="disabled"
            ></v-btn>

            <v-form ref="form" @submit.prevent="submit" :disabled="disabled">

                <v-card-text> 
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field label="adresse email" v-model="email" :rules="rulesEmail">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="numéro de téléphone" v-model="phoneNbr" :rules="rulesPhoneNbr">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" v-if="disabled">
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-progress-circular indeterminate></v-progress-circular>
                                <v-spacer></v-spacer>                          
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>



                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    text="Annuler"
                    @click="visible = false"
                    color="error"
                    :disabled="disabled"
                    ></v-btn>



                    <v-btn
                    text="Prendre rendez-vous"
                    color="primary"
                    type="submit"
                    :disabled="disabled"
                    ></v-btn>

                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>

<script>
    import {formatTime} from '@/utils/date'
    import WhitelistService from '@/services/WhitelistService';
    export default{
        data()
        {
            return{
                visible:this.modelValue,

                email:'',
                phoneNbr:'',

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
                rulesPhoneNbr:[
                    phoneNbr =>{
                        if(!phoneNbr)
                            return "un numéro de téléphone est requis"
                        return true
                    },
                    phoneNbr =>{
                        const internationalRegexp = /^\+\d{11}$/;
                        const frenchRegexp = /^\d{10}$/;
                        if(!internationalRegexp.test(phoneNbr) && !frenchRegexp.test(phoneNbr))
                            return 'numéro de téléphone invalide'
                        return true
                    }
                ]
            }
        },
        props:{
            modelValue:{
                type:Boolean,
                required:true
            },
            start:{
                type:Date,
                required: true
            },
            consultationType:{
                type:Object,
                required:true
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        emits:['confirmed'],
        methods:{
            async submit()
            {
                const {valid} = await this.$refs.form.validate()
                // console.log(valid);
                if(!valid)
                    return
                console.log("about to emit : "+this.email+", "+this.phoneNbr);
                
                this.$emit('confirmed',this.email,this.phoneNbr)
            }
        },
        computed:{
            formatedTime(){
                return formatTime(this.start,this.consultationType.duration)
            },
            title(){
                // console.log(JSON.stringify(this.consultationType));
                
                return `${this.consultationType.title} - ${this.formatedTime}`
                // return ''
            }
        },
        watch:{
            modelValue(newValue){
                this.visible = newValue
            },
            visible(newValue){
                this.$emit('update:modelValue',newValue)
            }
        }
    }


</script>