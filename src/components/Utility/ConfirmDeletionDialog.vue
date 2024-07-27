<template>
    <v-dialog v-model="dialogVisible" max-width="400">
        <v-card>
            <v-card-title class="headline">Confirmation de la suppression</v-card-title>
            <v-card-text v-html="message"></v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-checkbox label="ne plus me demander" v-model="dontAskToDelete"></v-checkbox>
            <v-btn color="primary" text @click="abortDelete">Annuler</v-btn>
            <v-btn color="red" text @click="confirmDelete">Supprimer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default{
    name:"ConfirmDeletionDialog",
    data(){
        return {

        }
    },
    props:{
        modelValue:{
            type:Boolean,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        vmodelDontAskToDelete:{
            type:Boolean,
            required:true
        }
    },
    emits: ['update:modelValue','update:vmodelDontAskToDelete','delete'],
    methods: {
        updateValue(newValue) {
            this.$emit('update:modelValue', newValue);
        },
        abortDelete(){
            this.dialogVisible = false
        },
        confirmDelete(){
            // console.log("confirming delete");

            this.dialogVisible = false

            this.$emit('delete')
        }
    },
    // watch: {
    //     modelValue:{
    //         handler(newValue) {
    //         if(newValue && this.dontAskToDelete)
    //         {
    //             this.dialogVisible = false
    //             this.$emit('delete')
    //         }

    //         // console.log(`Message changed from ${oldValue} to ${newValue}`);
    //     },immediate: true 
    //     }

    // },
    computed:{
        dialogVisible:{
            get(){
                return this.modelValue
            },
            set(value){
                this.$emit('update:modelValue',value)
            }
        },
        dontAskToDelete:{
            get(){
                return this.vmodelDontAskToDelete
            },
            set(value){
                this.$emit('update:vmodelDontAskToDelete',value)
            }
        }
    }
}
</script>