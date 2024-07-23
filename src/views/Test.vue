<template>
    <h1>Page de test :</h1>

    <v-sheet class="mx-auto" width="400" height="190">
        <v-form ref="addForm" @submit.prevent="addEmail">
            <v-text-field
                v-model="emailToAdd"
                :rules="rules"
                label="Email à ajouter"
            ></v-text-field>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Test-Page',
    components: {},

    data() {
        return {
            emailToAdd: "",
            rules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ]
        };
    },

    computed: {
        ...mapState(['session'])
    },

    methods: {
        async addEmail() {
            const addForm = this.$refs.addForm;
            const valid = await addForm.validate().valid;
            console.log("Validation status:", valid); // Debugging log
            if (!valid) {
                console.log("invalid add form");
                return;
            }
            console.log("validate passed");

            // The rest of your addEmail logic
        }
    },

    watch: {},

    async mounted() {}
};
</script>
