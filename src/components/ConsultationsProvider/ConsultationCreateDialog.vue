<template>
    <v-dialog v-model="dialogVisible">
        <v-card>
            <v-form ref="form" @submit.prevent="create">
                <v-card-title>Création d'une nouvelle consultation</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <!-- <v-text-field v-model="email" label="email" :rules="rulesEmail"></v-text-field> -->
                                <EmailSearchField v-model="email" :rules="rulesEmail"></EmailSearchField>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="telephone" label="téléphone" :rules="rulesTelephone" ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <ConsultationsTypeSelect v-model="typeConsultation" :rules="rulesConsultationType"></ConsultationsTypeSelect>
                        </v-col>
                    </v-row>
                    <v-row>
                        <TimeAndDatePicker v-model="dateConsultation" :min-hour="minHour" :max-hour="maxHourOffset" :min-date="minDate"></TimeAndDatePicker>
                    </v-row>
                </v-card-text>

                <v-card-actions class="mr-10">
                    <v-row>
                        <v-spacer></v-spacer>

                        <v-btn color="primary" type="submit">Créer la consultation</v-btn>
                        <!-- <v-spacer></v-spacer> -->
                    </v-row>

                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
    import dateUtils from '@/utils/date'
    import ConsultationsTypeSelect from '../Consultations/ConsultationsTypeSelect.vue';
    import TimeAndDatePicker from '../Utility/TimeAndDatePicker.vue';
    import EmailSearchField from '../Utility/EmailSearchField.vue';
    // import { VTimePicker } from 'vuetify/labs/VTimePicker'
    // import { VDateInput } from 'vuetify/labs/VDateInput'
    import consultationTypesService from '@/services/ConsultationTypesService';
    import SettingsService from '@/services/SettingsService';

    import consultationRules from '@/utils/rules/consultationRules';


    export default{
        name:"ConsultationCreateDialog",
        components:{
            ConsultationsTypeSelect,
            TimeAndDatePicker,
            EmailSearchField
        },
        props:{
            startDate:{
                type:Date,
                required:true
            },
            modelValue:{
                type:Boolean,
                required:true
            }
        },
        watch:{
            startDate(newValue)
            {
                console.log("setting start date : "+newValue);
                
                this.dateConsultation = newValue
            },
            async typeConsultation(newValue)
            {
                var idType

                // console.log("t : "+typeof newValue);
                if(newValue==null || typeof newValue =="string")
                {
                    return
                }

                if(typeof newValue === "number" ||newValue instanceof Number){
                    // console.log("n");
                    
                    idType = newValue
                }

                else{
                    // console.log("o");
                    
                    idType = newValue.value
                }


                // console.log("id type : "+idType+"new v "+JSON.stringify(newValue));
                


                const {duree_minutes:duration} = await consultationTypesService.getConsultationType(idType)

                this.duration = duration

                const min = await SettingsService.getSetting("heure_debut_calendrier")
                const max = await SettingsService.getSetting("heure_fin_calendrier")

                this.minHour = min
                this.maxHour = max
            }
        },
        computed:{
            dialogVisible:{
                get()
                {
                    return this.modelValue
                },
                set(value)
                {
                    this.$emit('update:modelValue',value)
                }
            },
            maxHourOffset:{
                get()
                {
                    // console.log((typeof this.maxHour)+" : "+this.maxHour);
                    
                    const maxMinutes = hourToMinutes(this.maxHour)
                    const totalMinutes = maxMinutes - this.duration

                    const hours = Math.floor(totalMinutes/60)
                    const minutes = totalMinutes%60

                    // console.log(maxMinutes);
                    

                    return `${hours}:${minutes}:00`
                }
            }
        },
        emits:['create'],
        methods:{
            formatDate(){
                const date = this.dateConsultation

                // console.log(date+", "+duration);
                

                return dateUtils.formatTime(date,this.duration)
            },
            async create()
            {
                const form = this.$refs.form

                const {valid} = await form.validate()

                if(!valid)
                {
                    console.log("form invalid !");
                    return
                }   


                var idType;
                
                if( (typeof this.typeConsultation) == "number")
                {
                    idType = this.typeConsultation 
                }
                else //if typeof Object
                {
                    idType = this.typeConsultation.value
                }

                const consultation = {
                    start:this.dateConsultation,
                    typeid:idType,
                    email:this.email,
                    telephone:this.telephone}
                // const consultation = {}
                this.$emit('create',consultation)
            }
        },
        data(){
            // const date = new Date(this.startDate)
            // console.log("date : "+JSON.stringify(date));
            const minDate = new Date()
            minDate.setHours(0,0,0,0)
            return{
                typeConsultation:null,
                dateConsultation:null,

                minHour:"00:00",
                maxHour:"23:59",

                minDate:minDate,

                duration:0,
                email:"",
                telephone:"",

                rulesConsultationType:consultationRules.rulesConsultationType,
                rulesEmail:consultationRules.rulesEmail,
                rulesTelephone:consultationRules.rulesTelephone
            }
        }
    }

    function hourToMinutes(hour)
    {
        const [hours,minutes] = hour.split(":")

        // console.log("h : "+hours+", m : "+minutes);
        

        return Number(hours)*60+Number(minutes)
    }
</script>