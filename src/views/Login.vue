<template>
  <div id="app">
    <h1>Connexion</h1>
    <p>Ceci est la page de connexion pour Christelle Dubreuil. Si vous êtes un/une patient(e) qui a réussi à arriver jusque là, je vous tire mon chapeau !</p>
    <form @submit.prevent="handleLogin">
      <input type="password" v-model="password" id="password">
      <br>
      <input type="submit" value="Se connecter">
    </form>
  </div>
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