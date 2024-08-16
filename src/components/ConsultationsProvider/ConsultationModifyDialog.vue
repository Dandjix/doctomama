<template>
    <v-dialog v-model="dialogVisible">
        <v-card>
            <v-form ref="form" @submit.prevent="update">
                <v-card-title>{{ consultation.title }}</v-card-title>
                <v-card-text>
                    <v-row>

                        <v-col cols="12" md="6" >
                            <!-- <v-text-field :disabled="consultation.eventType!='consultation_new'" 
                                v-model="email" 
                                label="email" 
                                :rules="rulesEmail"></v-text-field> -->
                            <EmailSearchField 
                            v-model="email" 
                            :rules="rulesEmail"
                            :disabled="consultation.eventType!='consultation_new'" 
                            label="email" ></EmailSearchField>
                        </v-col>

                        <v-col cols="12" md="6" >
                            <v-text-field :disabled="consultation.eventType!='consultation_new'" 
                                v-model="telephone" 
                                label="téléphone" 
                                :rules="rulesTelephone"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12" >
                            <ConsultationsTypeSelect v-model="typeConsultation" :rules="rulesConsultationType"></ConsultationsTypeSelect>
                        </v-col>

                        <!-- <v-col cols="12" md="6" class="d-flex justify-center"> -->

                        <TimeAndDatePicker 
                        v-model="timeConsultation" 
                        :min-hour="minHour" 
                        :max-hour="maxHourOffset" 
                        :min-date="minDate"
                        :disabledDates="disabledDates" class="mx-10"></TimeAndDatePicker>

                        <!-- </v-col> -->

                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <p>{{consultation.title}} - {{formatDate()}}</p>
                        <v-spacer></v-spacer>
                    </v-row>

                    <!-- <v-row>
                        <h1>debug MDD</h1>
                        {{ disabledDates }}
                    </v-row> -->
                </v-card-text>

                <v-card-actions class="mr-10">
                    <v-row justify="end">
                        <v-col cols="12" md="3">
                            <v-btn @click="resetConsultation" color="yellow-darken-4" block>Réinitialiser</v-btn>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-btn @click="deleteConsultation" color="error" block>Supprimer</v-btn>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-btn color="primary" type="submit" block>Confirmer les modifications</v-btn>
                        </v-col>
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
        name:"ConsultationModifyDialog",
        components:{
            ConsultationsTypeSelect,
            TimeAndDatePicker,
            EmailSearchField
        },
        props:{
            consultation:{
                type:Object,
                required:true
            },
            modelValue:{
                type:Boolean,
                required:true
            },
            disabledDates:{
                type:Array,
                default:()=>[]
            }
        },
        watch:{
            async consultation(newValue)
            {
                const typeId = newValue.typeid

                this.typeConsultation = typeId


                this.timeConsultation = new Date(newValue.start)


                var idType
                if( (typeof this.typeConsultation) == "number"){
                    idType = this.typeConsultation
                }
                else { //if typeof Object
                    idType = this.typeConsultation.value
                }




                this.email = newValue.email
                this.telephone = newValue.telephone
                this.eventType = newValue.eventType

                const {duree_minutes:duration} = await consultationTypesService.getConsultationType(idType)

                this.duration = duration

                const min = await SettingsService.getSetting("heure_debut_calendrier")
                const max = await SettingsService.getSetting("heure_fin_calendrier")

                this.minHour = min
                this.maxHour = max

                // console.log("min and max set : "+this.minHour+", "+this.maxHour);
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
        emits:['reset','update','delete'],
        methods:{
            formatDate(){
                const date = this.consultation.start

                // console.log(date+", "+duration);
                

                return dateUtils.formatTime(date,this.duration)
            },
            async update()
            {
                const form = this.$refs.form

                const {valid: validFromValidation} = await form.validate()

                if(!validFromValidation)
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

                const start = this.timeConsultation

                
                const consultation = {
                    id:this.consultation.id,
                    email:this.email,
                    telephone:this.telephone,
                    start:start,
                    eventType:this.eventType,
                    typeid:idType}

                this.$emit('update',consultation)
            },
            deleteConsultation()
            {
                const id = this.consultation.id
                this.$emit('delete',id)
            },
            resetConsultation()
            {
                const id = this.consultation.id
                this.$emit('reset',id)
            },
            hourConsultationUpdateHour(value)
            {
                if(this.hourConsultation==null)
                    return

                // console.log("value : "+value);
                const parts = this.hourConsultation.split(':')
                if(parts.length<2){
                    this.hourConsultation = `${value}:00`
                    return
                }

                const minutes = parts[1]
                this.hourConsultation = `${value}:${zeroPad(minutes)}`
            }
        },
        data(){
            const minDate = new Date()
            minDate.setHours(0,0,0,0)
            return{
                typeConsultation:null,
                timeConsultation:null,

                minHour:"00:00",
                maxHour:"23:59",

                minDate:minDate,

                duration:0,
                email:"",
                telephone:"",
                eventType:"",

                rulesConsultationType:consultationRules.rulesConsultationType,
                rulesDate:consultationRules.rulesDate,
                rulesTimePicker:consultationRules.rulesTimePicker,
                rulesEmail:consultationRules.rulesEmail,
                rulesTelephone:consultationRules.rulesTelephone
            }
        }
    }

    function zeroPad(value)
    {
        return value.toString().padStart(2,'0')
    }

    function hourToMinutes(hour)
    {
        const [hours,minutes] = hour.split(":")

        // console.log("h : "+hours+", m : "+minutes);
        

        return Number(hours)*60+Number(minutes)
    }
</script>