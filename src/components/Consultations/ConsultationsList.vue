<template>
    <v-row>
        <v-col v-for="consultation in consultations" :key="consultation.id" cols="12" sm="6" md="4" xl="3">
            <ConsultationItem :consultation="consultation" @cancel="cancel"></ConsultationItem>
        </v-col>
    </v-row>

</template>

<script>
    import ConsultationItem from '@/components/Consultations/ConsultationItem.vue'

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