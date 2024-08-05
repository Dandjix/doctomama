<template>
    <!-- <h1>Patient·e·s authorisé·e·s :</h1> -->

    <v-sheet class="mx-auto" width="400" height="190">
        <v-form ref="addForm" @submit.prevent="addEmail" >
            <v-text-field
            v-model="emailToAdd"
            :rules="rules"
            label="Email à ajouter"

            ></v-text-field>
            <v-btn class="mt-2" type="submit" color="primary" block>Ajouter</v-btn>
        </v-form>
    </v-sheet>

    <v-sheet class="mx-auto" width="400">
        <v-spacer></v-spacer>
        <v-text-field label="Rechercher" prepend-inner-icon="mdi-magnify" v-model="patern"></v-text-field>
        <v-spacer></v-spacer>
    </v-sheet>

    <v-row>
        <v-spacer></v-spacer>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        <v-spacer></v-spacer>
    </v-row>


    <v-pagination :length="nbPages" v-model="page" :disabled="loading"></v-pagination>

    <Whitelist :emails="emails" @deleteItem="deleteItem" :disabled="loading"></Whitelist>

    <v-pagination :length="nbPages" v-model="page" :disabled="loading"></v-pagination>

    <ConfirmDeletionDialog v-model="deletionDialog" :message="deleteMessage"
     v-model:vmodel-dont-ask-to-delete="dontAskToDelete" @delete="confirmDelete"></ConfirmDeletionDialog>

</template>

<script>
import Whitelist from '../components/Whitelist.vue'
import ConfirmDeletionDialog from '@/components/Utility/ConfirmDeletionDialog.vue';

import WhitelistService from '@/services/WhitelistService';
import { mapState } from 'vuex';

export default {
    name:'Liste-des-patient·e·s-authorisé·e·s',
    components:
    {
        Whitelist,
        ConfirmDeletionDialog
    },

    methods:{
        deleteItem(email){
            // console.log("deleting email : "+email);
            // console.log(JSON.stringify(this.emails));

            if(!this.dontAskToDelete)
            {

                this.emailToDelete=email
                this.deleteMessage = `Êtes vous sûr·e de vouloir supprimer : <b>${email}</b>  de vos patient·e·s authorisé·e·s ?`
                this.deletionDialog=true
                // console.log("message set");
            }
            else
            {
                this.emailToDelete=email
                this.confirmDelete()
            }
        },
        async confirmDelete(){
            // console.log("dans confirmDelete");
            this.loading=true
            this.deletionDialog=false

            await WhitelistService.deleteItem(this.session,this.emailToDelete)

            this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)

            if(this.page>this.nbPages)
                this.page = this.nbPages;

            // console.log("nb pages : "+this.nbPages);
            if(this.nbPages>0)
            {
                this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)     
            }
            else
            {
                this.emails = []
            }


            this.loading = false

            // console.log("at the end !");
        },
        async addEmail(){

            this.loading=true

            const addForm = this.$refs.addForm
            const validRes = await addForm.validate()
            const isValid = validRes.valid
            if(!isValid)
            {
                this.loading = false
                // console.log("invalid add form");
                return;
            }
            // console.log("validate passed");

            // console.log("dans add email  : "+this.emailToAdd);


            try{
                await WhitelistService.addItem(this.session,this.emailToAdd)

                this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)
                if(this.page>this.nbPages)
                    this.page = this.nbPages
                else if(this.page<1)
                    this.page=1

                this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
            }
            catch(error)
            {
                alert("Impossible d'ajouter cet email. Existe-t-il déja ?")
            }
            finally
            {
                this.loading = false
            }

        },
        async pageChanged(){

            // const delay = millis => new Promise((resolve) => {
            //     setTimeout(() => resolve(), millis)
            // });

            this.loading=true

            // await delay(500)

            if(this.nbPages>0){
                this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
            }
            else{
                this.emails = []
            }



            // await delay(500)

            this.loading = false
        },
        async paternChanged(){


            // const delay = millis => new Promise((resolve) => {
            //     setTimeout(() => resolve(), millis)
            // });

            this.loading=true

            // await delay(500)

            this.page = 1

            this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)
            if(this.nbPages>0){
                this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
            }
            else{
                this.emails=[]
            }

            // await delay(500)

            this.loading = false

        }
    },
    computed:{
      ...mapState(['session'])
    },
    watch: {
        page(newVal) {
            this.pageChanged(newVal);
        },
        patern(newVal){
            this.paternChanged(newVal);
        }
    },
    data(){
        return {
            emails:[],

            nbPages:0,
            page:1,//number displayed on the page selector. page -1 is the actual page
            patern:'',

            loading:false,

            deletionDialog:false,
            dontAskToDelete:false,
            deleteMessage:"",
            emailToDelete:"",

            emailToAdd:"",

            rules: [
                v => !!v || 'Email requis',
                v => /.+@.+\..+/.test(v) || 'Email invalide',
                v => /^[a-zA-Z0-9\u0400-\u04FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF@.-]+$/.test(v) || 'Cet email contient des charactères invalides'
            ]
        }
    },
    async mounted()
    {
        this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)
        // console.log("there are "+JSON.stringify(this.nbPages)+" pages");
        if(this.nbPages>0)
            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
        else
            this.emails=[]
    }


};
</script>