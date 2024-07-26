
<template>
    <v-form>
        <v-text-field label="Nom du type de consultation"></v-text-field>
        <v-number-input
            :reverse="false"
            controlVariant="default"
            label="Durée (minutes)"
            :hideInput="false"
            :inset="false"
        ></v-number-input>
    </v-form>
</template>
<script>
// import consultationTypesService from '@/services/ConsultationTypesService'
export default{
    name:"ConsultationTypesAdd",
    data(){
        return{

        }
    },
    methods:{

    },
    async mounted()
    {

    }
}
</script>