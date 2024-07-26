
<template>
    <v-form @submit.prevent="update" ref="form" >
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-progress-circular
                        v-if="loading"
                        indeterminate
                    ></v-progress-circular>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field label="Nom du type de consultation"
                        v-model="typeConsultation.nom"
                        :disabled="loading"
                        :rules="necessaryRules"
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-number-input
                        controlVariant="default"
                        label="Durée (minutes)"
                        min="1"
                        max="1440"

                        v-model="typeConsultation.duree_minutes"
                        :disabled="loading"
                        :rules="necessaryRules"
                    ></v-number-input>
                </v-col>
                <v-col>
                    <v-btn block color="primary" type="submit" :disabled="loading">Modifier</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script>
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import consultationTypesService from '@/services/ConsultationTypesService'
import { mapState } from 'vuex';

export default{
    name:"ConsultationTypesGet",
    methods:{
        async update(){
            const form = this.$refs.form
            const res = await form.validate()
            if(!res.valid)
            {
                return
            }
            // console.log(JSON.stringify(res))
            // console.log("updating ...");
            // console.log("session : "+this.session);
            await consultationTypesService.updateConsultationType(this.session,this.id,this.typeConsultation.nom,this.typeConsultation.duree_minutes)
        
            this.$router.push({ name: 'ConsultationTypes' });
        },
        // changed(){
        //     return this.typeConsultation.duree_minutes != this.originaltypeConsultation.duree_minutes 
        //     || this.typeConsultation.nom != this.originaltypeConsultation.nom
        // }
    },
    components:{
        VNumberInput
    },
    data(){
        return{
            id:-1,
            typeConsultation : {nom:'',duree_minutes:1},
            originaltypeConsultation : {nom:'',duree_minutes:1},
            loading : true,
            necessaryRules:[
                v=> !!v || 'Ce champ est obligatoire'
            ]
        }
    },
    computed:{
        ...mapState(["session"])
    },
    async mounted()
    {
        this.loading = true
        this.id = this.$route.params.id;

        this.typeConsultation = await consultationTypesService.getConsultationType(this.id)
        this.originaltypeConsultation = {...this.typeConsultation}

        this.loading = false
    }
}
</script>