<template>
    <v-dialog v-model="visible" persistent>
        <v-card>
            <v-card-title>Une ou plusieurs consultations en chevauchent d'autres : </v-card-title>

            <v-card-text v-for="(consultation,index) in consultations" :key="consultation.id">
                {{ consultation.title }}, le {{ formatSpan(consultation.start,consultation.end) }}
                <v-divider v-if="index<consultations.length-1" class="mt-10"></v-divider>
            </v-card-text>

            <v-card-actions> 
                <v-btn color="error" @click="revert">Annuler</v-btn>
                <v-btn color="primary" @click="commit">Sauvegarder quand-même</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import dateUtils from '@/utils/date';
    export default{
        name:"ConsultationModifyOverlapDialog",
        props:{
            modelValue:{
                type:Boolean,
                required:true
            },
            consultations:{
                type:Array,
                default:()=>[]
            }
        },

        computed:{
            visible:{
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
        emits:['commit','revert'],
        methods:{
            commit()
            {
                this.$emit('commit')
            },
            revert()
            {
                this.$emit('revert')
            },
            formatSpan(start,end)
            {
                return dateUtils.formatSpan(start,end)
            }
        }
    }

</script>