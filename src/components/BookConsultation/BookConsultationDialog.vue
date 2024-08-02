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
                            <v-text-field label="adresse email" :rules="rulesEmail">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="numéro de téléphone" :rules="rulesPhoneNbr">
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
                    color="red"
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
    export default{
        data()
        {
            return{
                visible:this.modelValue,
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
                this.$emit('confirmed',this.email,this.phoneNbr)
            }
        },
        computed:{
            formatedTime(){
                const days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
                const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Novembre','Décembre']

                const start = new Date(this.start)
                const end = new Date(start)
                end.setMinutes(start.getMinutes()+this.consultationType.duration)
                
                const day = days[start.getDay()-1]
                const date = start.getDate()
                const month = months[start.getMonth()]
                const year = start.getFullYear()
                const startHour = `${zeroPad(start.getHours())}:${zeroPad(start.getMinutes())}`
                const endHour = `${zeroPad(end.getHours())}:${zeroPad(end.getMinutes())}`

                return `${day} ${date} ${month} ${year} de ${startHour} à ${endHour}`

                // return "Lundi 18 Janvier 2024 de 08:00 à 9:00"
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

    function zeroPad(number)
    {
        const res = String(number).padStart(2,'0')
        return res
    }
</script>