<template>
    <v-row>
        <v-col v-for="consultation in consultations" :key="consultation.id" cols="12" sm="6" md="4" xl="3">
            <ConsultationItem :consultation="consultation" @cancel="cancel"></ConsultationItem>
        </v-col>

        <v-col v-if="consultations.length==0">
            <h3>Vous n'avez pas de consultations</h3>
        </v-col>
    </v-row>

</template>

<script>
    import ConsultationItem from '@/components/ConsultationsPatient/ConsultationItem.vue'

    export default{
        name:'ConsultationsList',
        components:{
            ConsultationItem
        },
        props:{
            consultations:{
                type:[],
                required:true
            }
        },
        data()
        {
            return{
            }
        },
        emits:['cancel'],
        methods:{
            cancel(id)
            {
                this.$emit('cancel',id)
            }
        }
    }
</script>