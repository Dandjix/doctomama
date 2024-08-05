<template>
    <h1>Page de test :</h1>

    <v-card width="700" class="mx-auto my-auto">
            <v-card-title v-if="consult">Annuler {{ consult.nom }} le {{ formatTime }}</v-card-title>


            <v-card-text>
                Un code a été envoyé à votre adresse email : {{ email }}. Copiez le ici pour annuler votre rendez-vous.
            </v-card-text>

            <v-otp-input length="6" v-model="code"></v-otp-input>



            <v-card-text>
                (Ceci est nécessaire afin que seulement vous puissiez annuler vos rendez-vous)
            </v-card-text>
            <v-row>
                <v-spacer></v-spacer>
                <v-btn color="primary" width="200" @click="resend">Renvoyer</v-btn>
                <v-spacer></v-spacer>
            </v-row>

            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="8">
                    <v-progress-linear color="primary" indeterminate></v-progress-linear>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>

            <v-row>
                <v-spacer></v-spacer>
                <v-progress-circular indeterminate></v-progress-circular>
                <v-spacer></v-spacer>
            </v-row>


            <v-card-actions>
                <v-btn color="error" @click="cancel">Revenir en arrière</v-btn>
            </v-card-actions>

        </v-card>
</template>

<script>


export default {
    name: 'Test-Page',
    components: {},

    data() {
        return {
            code:'',
            cooldown:99
        };
    },

    computed: {

    },

    methods: {

    },

    watch: {},

    async mounted() {}
};
</script>
