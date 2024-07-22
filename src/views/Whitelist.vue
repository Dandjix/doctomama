<template>
    <h1>Patient·e·s authorisé·e·s :</h1>

    <v-sheet class="mx-auto" width="400">
        <v-form @submit.prevent>
            <v-text-field
            v-model="firstName"
            :rules="rules"
            label="Email à ajouter"
            ></v-text-field>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
        </v-form>
    </v-sheet>

    <v-sheet class="mx-auto" width="400">
        <v-spacer></v-spacer>
        <v-text-field label="Rechercher" prepend-inner-icon="mdi-magnify" v-model="patern"></v-text-field>
        <v-spacer></v-spacer>
    </v-sheet>

    <v-pagination :length="nbPages" v-model="page" :disabled="loading"></v-pagination>

    <Whitelist :emails="emails" @deleteItem="deleteItem"></Whitelist>

    <v-pagination :length="nbPages" v-model="page" :disabled="loading"></v-pagination>

    <v-dialog v-model="deletionDialog" max-width="400">
        <v-card>
            <v-card-title class="headline">Confirmation de la suppression</v-card-title>
            <v-card-text>Êtes vous sûr·e de vouloir supprimer : <b>{{ emailToDelete }}</b>  de vos patient·e·s authorisé·e·s ?</v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
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
            this.deletionDialog=true
            this.emailToDelete=email

        },
        abortDelete(){
            this.deletionDialog=false
        },
        confirmDelete(){
            const index = this.emails.indexOf(this.emailToDelete)
            this.emails.splice(index,1)

            this.deletionDialog=false
        },
        addEmail(){
            if(this.emailToAdd)
            console.log(this.emailToAdd);
            this.emailToAdd = ""
        },
        async pageChanged(){
            // console.log("page changed to : "+this.page);
            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
        },
        async paternChanged(){
            this.page = 1
            this.emails = await WhitelistService.getItems(this.session,this.page-1,this.patern)
            this.nbPages = await WhitelistService.getNbPages(this.session,this.patern)
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
            emailToDelete:"",

            emailToAdd:""
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