<template>
    <v-dialog v-model="visible" persistent>
        <v-card>
            <v-card-title>Un rendez-vous chevauche un autre rendez-vous</v-card-title>
            <v-card-actions> 
                <v-btn color="error" @click="revert">Annuler</v-btn>
                <v-btn color="primary" @click="commit">Sauvegarder quand-même</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default{
        name:"ConsultationModifyOverlapDialog",
        props:{
            modelValue:{
                type:Boolean,
                required:true
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
            }
        }
    }

</script>