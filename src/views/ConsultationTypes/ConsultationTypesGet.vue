
<template>
    <h1>Types de consultation :</h1>
    <v-col>
        <ConsultationTypesList class="mb-5"></ConsultationTypesList>

        <v-divider></v-divider>

        <ConsultationTypesAdd class="mt-5"></ConsultationTypesAdd>
    </v-col>

</template>
<script>

import ConsultationTypesList from '@/components/ConsultationTypes/ConsultationTypesList.vue';
import ConsultationTypesAdd from '@/components/ConsultationTypes/ConsultationTypesAdd.vue';
export default{
    name:"ConsultationTypesGet",
    methods:{

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