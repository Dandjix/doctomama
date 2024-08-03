<template>
    <v-card>
        <v-card-title>{{ consultation.nom }}</v-card-title>
        <v-row>
            <v-col cols="8">
                <v-card-text>{{ formatedTime }}</v-card-text>
            </v-col>
            <v-col cols="4">
                <v-btn color="red" @click="cancel">Annuler</v-btn>
            </v-col>

        </v-row>

    </v-card>
</template>

<script>
    import {formatTime} from '@/utils/date'

    export default{
        name:'ConsultationItem',
        props:{
            consultation:{
                type:Object,
                required:true
            }
        },
        computed:{
            formatedTime(){
                return formatTime(this.consultation.debut,this.consultation.duree_minutes)
            }
        },
        emits:['cancel'],
        methods:{
            cancel(){
                this.$emit('cancel',this.consultation.id)
            }
        }
    }
</script>