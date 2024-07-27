
<template>
    <v-form @submit.prevent="addConsultationType" ref="form">
        <v-row>

            <v-col cols="12">
                <h1>Ajouter un type de consultation</h1>
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field label="Nom du type de consultation"
                placeholder="détartrage" 
                    v-model="name"
                    :rules="rules"
                ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
                <v-number-input
                    :reverse="false"
                    controlVariant="default"
                    label="Durée (minutes)"
                    :hideInput="false"
                    :inset="false"
                    min="1"
                    max="1440"
                    v-model="duration"
                    :rules="rules"
                ></v-number-input>
            </v-col>

            <v-col cols="12" md="3">
                <v-btn type="submit" color="primary" block class="pa-6">Ajouter</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script>
// import consultationTypesService from '@/services/ConsultationTypesService'
// import { addConsultationType } from '@/models/ConsultationTypes';
import { VNumberInput } from 'vuetify/labs/VNumberInput'
export default{
    name:"ConsultationTypesAdd",
    components:{
        VNumberInput
    },
    data(){
        return{
            duration:30,
            name:"",
            rules:[
                (x)=> !!x||"Entrez une valeur"
            ]
        }
    },
    methods:{
        async addConsultationType()
        {
            const res = await this.$refs.form.validate()
            if(!res.valid)
            {
                return
            }
            this.$emit("add",this.name,this.duration)
        }
    },
    emits:['add'],
    async mounted()
    {

    }
}
</script>