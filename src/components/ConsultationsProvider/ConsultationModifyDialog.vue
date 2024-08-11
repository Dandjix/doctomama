<template>
    <v-dialog v-model="dialogVisible">
        <v-card>
            <v-card-title>{{ consultation.title }}</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-row>

                            <v-col cols="12">
                                <v-text-field disabled v-model="email" label="email" ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field disabled v-model="telephone" label="téléphone" ></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <ConsultationsTypeSelect v-model="typeConsultation"></ConsultationsTypeSelect>
                            </v-col>
                            <v-col cols="12">
                                <v-date-input 
                                v-model="dateConsultation"
                                color="primary" 
                                first-day-of-week="1" 
                                label="Date de la consultation" 
                                placeholder="jj/mm/aaaa"></v-date-input>
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
                        title="Heure de début de la consultation"></v-time-picker>
                    </v-col>
                </v-row>
                <v-row>
                    <v-spacer></v-spacer>
                    <p>{{consultation.title}} - {{formatDate()}}</p>
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogVisible=false" color="error">Revenir en arrière</v-btn>
                    <v-btn @click="update" color="primary">Confirmer les modifications</v-btn>
                    <v-spacer></v-spacer>
                </v-row>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import dateUtils from '@/utils/date'
    import ConsultationsTypeSelect from '../Consultations/ConsultationsTypeSelect.vue';
    import { VTimePicker } from 'vuetify/labs/VTimePicker'
    import { VDateInput } from 'vuetify/labs/VDateInput'
    import consultationTypesService from '@/services/ConsultationTypesService';
    import SettingsService from '@/services/SettingsService';

    export default{
        name:"ConsultationModifyDialog",
        components:{
            ConsultationsTypeSelect,
            // ConsultationModifyOverlapDialog,
            VTimePicker,
            VDateInput
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
                const {duree_minutes:duration} = await consultationTypesService.getConsultationType(idType)

                this.duration = duration

                this.email = newValue.email
                this.telephone = newValue.telephone

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
                    console.log((typeof this.maxHour)+" : "+this.maxHour);
                    
                    const maxMinutes = hourToMinutes(this.maxHour)
                    const totalMinutes = maxMinutes - this.duration

                    const hours = Math.floor(totalMinutes/60)
                    const minutes = totalMinutes%60

                    // console.log(maxMinutes);
                    

                    return `${hours}:${minutes}:00`
                }
            }
        },
        emits:['update'],
        methods:{
            formatDate(){
                const date = this.consultation.start

                // console.log(date+", "+duration);
                

                return dateUtils.formatTime(date,this.duration)
            },
            update()
            {
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
                // title:'',

                overlapDialog:false
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