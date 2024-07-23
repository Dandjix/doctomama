<template>
    <h1>Patient·e·s authorisé·e·s :</h1>

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

    <v-dialog v-model="deletionDialog" max-width="400">
        <v-card>
            <v-card-title class="headline">Confirmation de la suppression</v-card-title>
            <v-card-text>Êtes vous sûr·e de vouloir supprimer : <b>{{ emailToDelete }}</b>  de vos patient·e·s authorisé·e·s ?</v-card-text>
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
import Whitelist from '../components/Whitelist.vue'
import WhitelistService from '@/services/WhitelistService';
import { mapState } from 'vuex';

export default {
    name:'Liste-des-patient·e·s-authorisé·e·s',
    components:
    {
        Whitelist
    },

    methods:{
        deleteItem(email){
            // console.log("deleting email : "+email);
            // console.log(JSON.stringify(this.emails));

            if(!this.dontAskToDelete)
            {
                this.deletionDialog=true
                this.emailToDelete=email
            }
            else
            {
                this.emailToDelete=email
                this.confirmDelete()
            }
        },
        abortDelete(){
            this.deletionDialog=false
        },
        async confirmDelete(){
            this.loading=true
            this.deletionDialog=false


            // const index = this.emails.indexOf(this.emailToDelete)
            // this.emails.splice(index,1)
            await WhitelistService.deleteItem(this.session,this.emailToDelete)

            const nbPages = await WhitelistService.getNbPages(this.session,this.patern)

            if(this.page>nbPages)
                this.page = nbPages;

            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)

            this.loading = false
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



            await WhitelistService.addItem(this.session,this.emailToAdd)



            this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)
            if(this.page>this.nbPages)
                this.page = this.nbPages


            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)

            this.loading = false
        },
        async pageChanged(){

            // const delay = millis => new Promise((resolve) => {
            //     setTimeout(() => resolve(), millis)
            // });

            this.loading=true

            // await delay(500)


            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)


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
            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
            this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)

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
            emails:['jean@email.fr','bombeur@email.fr'],

            nbPages:0,
            page:1,//number displayed on the page selector. page -1 is the actual page
            patern:'',

            loading:false,

            deletionDialog:false,
            dontAskToDelete:false,
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
        this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
    }


};
</script>