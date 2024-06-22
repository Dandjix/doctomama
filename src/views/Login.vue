<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-card-title>
              <h1>Connexion</h1>
            </v-card-title>
            <v-card-text>
              <p>Ceci est la page de connexion pour Christelle Dubreuil. Si vous êtes un/une patient(e) qui a réussi à arriver jusque là, je vous tire mon chapeau !</p>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                ></v-text-field>
                <v-btn type="submit" color="primary">Se connecter</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
  
<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      password: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      const success = await this.login({ password: this.password });
      if (success) {
        this.$router.push('/');  // Assuming you have a protected route
      } else {
        alert('Échec de la connexion');
      }
    }
  }
};
</script>