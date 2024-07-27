
<template>
    <!-- <v-table density="compact"> -->
    <v-table>
        <thead>
            <tr>
                <th>Nom du type de consultation</th>
                <th>Durée (minutes)</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="consult in consultationTypes"
                :key="consult.name"
            >
                <td>{{ consult.nom }}</td>
                <td>{{ consult.duree_minutes }}</td>
                <td>
                    <v-btn color="secondary" :to="'/consultationTypes/update/'+consult.id" :disabled="disabledValue">Modifier</v-btn>
                </td>
                <td>
                    <v-btn color="red" @click="deleteTypeConsultation(consult.id,consult.nom)" :disabled="disabledValue">Supprimer</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
    <ConfirmDeletionDialog 
        v-model:model-value="confirmDeletionDialog" 
        v-model:vmodel-dont-ask-to-delete="dontAskToDelete" 
        :message="message"
        @delete="confirmDelete"
    >

    </ConfirmDeletionDialog>
</template>
<script>
import consultationTypesService from '@/services/ConsultationTypesService'
import ConfirmDeletionDialog from '../Utility/ConfirmDeletionDialog.vue';

import { mapState } from 'vuex';
export default{
    name:"ConsultationTypesList",
    components:{
        ConfirmDeletionDialog
    },
    props:
    {
        disabled:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            // disabled:true,
            consultationTypes:[],
            typeConsultationToDeleteId:-1,
            message:"",
            confirmDeletionDialog:false,
            dontAskToDelete:false
        }
    },
    computed:{
        ...mapState(['session']),
        disabledValue:{
            get(){
                return this.disabled
            },
            set(value){
                this.$emit('update:disabled',value)
            }
        }
    },
    methods:{
        async deleteTypeConsultation(id,name)
        {
            if(this.dontAskToDelete)
            {
                this.typeConsultationToDeleteId = id
                await this.confirmDelete()
                return
            }

            this.typeConsultationToDeleteId = id
            this.message = `Êtes vous sûr·e de vouloir supprimer le type de consultation <b>${name}</b> ?`
            this.confirmDeletionDialog = true
        },
        async confirmDelete()
        {
            // console.log("confirm delete");
            this.disabledValue = true
            const id = this.typeConsultationToDeleteId
            await consultationTypesService.deleteConsultationType(this.session,id)
            // this.consultationTypes = await consultationTypesService.getConsultationTypes()
            await this.reload()
            this.disabledValue = false
        },
        async reload()
        {
            // console.log("reloading ...");
            this.consultationTypes = await consultationTypesService.getConsultationTypes()

        }
    },
    async mounted()
    {
        this.disabledValue = true
        await this.reload()
        this.disabledValue = false
    }
}
</script>