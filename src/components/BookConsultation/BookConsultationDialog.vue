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
    import dateUtils from '@/utils/date'
    // console.log("daeUtils : "+dateUtils);
    
    // import WhitelistService from '@/services/WhitelistService';
import { mapGetters } from 'vuex';
import consultationRules from '@/utils/rules/consultationRules';
    export default{
        data()
        {
            return{
                visible:this.modelValue,

                email:'',
                phoneNbr:'',

                rulesEmail:consultationRules.rulesEmail,
                rulesPhoneNbr:consultationRules.rulesTelephone
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
                // console.log("about to emit : "+this.email+", "+this.phoneNbr);
                
                this.$emit('confirmed',this.email,this.phoneNbr)
            }
        },
        computed:{
            ...mapGetters(['email_patient','telephone_patient']),
            formatedTime(){
                return dateUtils.formatTime(this.start,this.consultationType.duration)
                // return 'error'
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
        },
        mounted()
        {
            this.phoneNbr = this.telephone_patient
            this.email = this.email_patient
        }
    }


</script>