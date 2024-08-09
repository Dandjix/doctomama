<template>
    <v-dialog v-model="dialogVisible" persistent>
        <v-card>
            <v-card-title>{{ consultation.nom }}</v-card-title>

            <v-card-text></v-card-text>

            <v-card-actions>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogVisible=false" color="error">Revenir en arrière</v-btn>
                    <v-btn @click="update"></v-btn>
                    <v-spacer></v-spacer>
                </v-row>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default{
        name:"ConsultationModifyDialog",
        props:{
            consultation:{
                type:Object,
                required:true
            },
            modelValue:{
                type:Boolean,
                required:true
            }
        },
        computed:{
            dialogVisible:{
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
        emits:['update'],
        methods:{
            update()
            {
                
            }
        },
        data(){
            return{

            }
        }
    }
</script>