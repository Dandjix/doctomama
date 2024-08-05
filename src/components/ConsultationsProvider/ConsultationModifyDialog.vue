<template>
    <v-dialog v-model="visible">

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
        data(){
            return{
                
            }
        }
    }
</script>