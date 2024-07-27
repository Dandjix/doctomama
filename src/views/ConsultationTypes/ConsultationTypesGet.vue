
<template>
    <h1>Types de consultation :</h1>
    <v-col>
        <ConsultationTypesList class="mb-5" ref="list" :disabled="disabled"></ConsultationTypesList>


        <v-divider class="my-10"></v-divider>



        <ConsultationTypesAdd class="mt-5" @add="add"></ConsultationTypesAdd>
    </v-col>

</template>
<script>

import ConsultationTypesList from '@/components/ConsultationTypes/ConsultationTypesList.vue';
import ConsultationTypesAdd from '@/components/ConsultationTypes/ConsultationTypesAdd.vue';

import consultationTypesService from '@/services/ConsultationTypesService';
import { mapState } from 'vuex';
export default{
    name:"ConsultationTypesGet",
    methods:{
        async add(name,duration)
        {
            this.disabled = true
            await consultationTypesService.addConsultationType(this.session,name,duration)
            this.$refs.list.reload()
            this.disabled = false
        }
    },
    computed:{
        ...mapState(['session'])
    },
    data()
    {
        return{
            disabled:false
        }
    },
    components:{
        ConsultationTypesList,
        ConsultationTypesAdd
    },
    mounted()
    {

    }
}
</script>