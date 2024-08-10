<template>
    <v-dialog v-model="dialogVisible" persistent>
        <v-card>
            <v-card-title>{{ consultation.nom }}</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                            <ConsultationsTypeSelect v-model="typeConsultation"></ConsultationsTypeSelect>
                    </v-col>

                    <v-col cols="6">
                        <v-date-input first-day-of-week="1" label="Date de la consultation" placeholder="jj/mm/aaaa"></v-date-input>
                    </v-col>

                    <v-col cols="6">
                        <v-time-picker ></v-time-picker>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogVisible=false" color="error">Revenir en arrière</v-btn>
                    <v-btn @click="update"></v-btn>
                    <v-spacer></v-spacer>
                </v-row>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import ConsultationsTypeSelect from '../Consultations/ConsultationsTypeSelect.vue';
    import { VTimePicker } from 'vuetify/labs/VTimePicker'
    import { VDateInput } from 'vuetify/labs/VDateInput'
    export default{
        name:"ConsultationModifyDialog",
        components:{
            ConsultationsTypeSelect,
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
            consultation(newValue)
            {
                // console.log("nv : "+JSON.stringify(newValue));
                const typeId = newValue.typeid
                // console.log("ti : "+typeId);
                this.typeConsultation = typeId
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
            }
        },
        emits:['update'],
        methods:{
            update()
            {
                
            }
        },
        data(){
            return{
                typeConsultation:null
            }
        }
    }
</script>