<template>
    <v-dialog v-model="dialogVisible">
        <v-card>
            <v-form ref="form" @submit.prevent="update">
                <v-card-title>{{ consultation.title }}</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-row>

                                <v-col cols="12">
                                    <v-text-field v-model="email" label="email" :rules="rulesEmail"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field v-model="telephone" label="téléphone" :rules="rulesTelephone" ></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <ConsultationsTypeSelect v-model="typeConsultation" :rules="rulesConsultationType"></ConsultationsTypeSelect>
                                </v-col>
                                <v-col cols="12">
                                    <v-date-picker 
                                    v-model="dateConsultation"
                                    color="primary" 
                                    first-day-of-week="1" 
                                    label="Date de la consultation" 
                                    placeholder="jj/mm/aaaa"
                                    
                                    :rules="rulesDate"></v-date-picker>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-time-picker 
                            v-model="hourConsultation"
                            @update:hour="hourConsultationUpdateHour"
                            color="primary" 
                            format="24h"
                            :min="minHour"
                            :max="maxHourOffset"

                            title="Heure de début de la consultation"

                            :rules="rulesTimePicker"></v-time-picker>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <p>{{consultation.title}} - {{formatDate()}}</p>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-card-text>

                <v-card-actions class="mr-10">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn @click="deleteConsultation" color="error">Supprimer</v-btn>
                        <v-btn color="primary" type="submit">Confirmer les modifications</v-btn>
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
    import { VTimePicker } from 'vuetify/labs/VTimePicker'
    // import { VDateInput } from 'vuetify/labs/VDateInput'
    import consultationTypesService from '@/services/ConsultationTypesService';
    import SettingsService from '@/services/SettingsService';

    import consultationRules from '@/utils/rules/consultationRules';

    export default{
        name:"ConsultationCreateDialog",
        components:{
            ConsultationsTypeSelect,
            // ConsultationModifyOverlapDialog,
            VTimePicker,
            // VDateInput
        },
        props:{
            consultation:{
                type:Object,
                required:true
            },
            modelValue:{
                type:Boolean,
                required:true
            }
        },
        watch:{
            async consultation(newValue)
            {
                // console.log("nv : "+JSON.stringify(newValue));
                
                // console.log("nv : "+JSON.stringify(newValue));
                const typeId = newValue.typeid
                // console.log("ti : "+typeId);
                this.typeConsultation = typeId
                // this.title = newValue.title

                const startDate = new Date(newValue.start)
                const startHour = `${startDate.getHours()}:${zeroPad(startDate.getMinutes())}`

                startDate.setHours(0,0,0,0)

                this.dateConsultation = startDate
                this.hourConsultation = startHour

                var idType
                if( (typeof this.typeConsultation) == "number"){
                    idType = this.typeConsultation
                }
                else { //if typeof Object
                    idType = this.typeConsultation.value
                }




                this.email = newValue.email
                this.telephone = newValue.telephone

                const {duree_minutes:duration} = await consultationTypesService.getConsultationType(idType)

                this.duration = duration

                const min = await SettingsService.getSetting("heure_debut_calendrier")
                const max = await SettingsService.getSetting("heure_fin_calendrier")

                this.minHour = min
                this.maxHour = max
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
        emits:['update','delete'],
        methods:{
            formatDate(){
                const date = this.consultation.start

                // console.log(date+", "+duration);
                

                return dateUtils.formatTime(date,this.duration)
            },
            async update()
            {
                const form = this.$refs.form

                const {valid} = await form.validate()

                if(!valid)
                {
                    console.log("form invalid !");
                    return
                }   

                // console.log("cons : "+JSON.stringify(this.consultation));
                // console.log("tc : "+JSON.stringify(this.typeConsultation));

                var idType;
                // console.log("t : "+(typeof this.typeConsultation));
                
                if( (typeof this.typeConsultation) == "number")
                {

                    idType = this.typeConsultation
                    // console.log("itsa number :"+idType);
                    
                }
                else //if typeof Object
                {

                    idType = this.typeConsultation.value
                    // console.log("itsa obj :"+idType);
                }

                // console.log("idt : "+idType);
                
                
                
                const hourParts = this.hourConsultation.split(':')
                const start = new Date(this.dateConsultation)
                start.setHours(hourParts[0],hourParts[1])
                
                const consultation = {id:this.consultation.id,start:start,typeid:idType}
                // const consultation = {}
                this.$emit('update',consultation)
            },
            deleteConsultation()
            {
                const id = this.consultation.id
                this.$emit('delete',id)
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
            return{
                typeConsultation:null,
                dateConsultation:null,
                hourConsultation:null,

                minHour:"00:00:00",
                maxHour:"23:59:59",

                duration:0,
                email:"",
                telephone:"",

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