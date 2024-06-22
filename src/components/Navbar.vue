<template>
  <v-app-bar app>
    <v-toolbar-title>
      <router-link :to="isLoggedIn ? '/' : '/login'">Page d'accueil</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn v-if="isLoggedIn" @click="logout">Se déconnecter</v-btn>
      <v-btn v-else-if="currentRoute === '/login'" to="/">Page d'accueil</v-btn>
      <v-btn v-else to="/login">Se connecter</v-btn>
      <v-btn to="/availability" v-if="isLoggedIn">Modifier mes disponibilités</v-btn>
      <v-btn to="/book-rdv" v-else>Prendre rendez-vous</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
  
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name:"NavigationBar",
  // data() {
  //   return {
  //     isLoggedIn: false, // This should be set based on your authentication logic
  //   };
  // },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
    ...mapState(['isLoggedIn']) // Map 'isLoggedIn' from Vuex store to this component's computed properties
  },
  methods: {
    ...mapActions(['logout'])
  },
};
</script>
  
  <style scoped>
  /* Add your navbar styles here */
  nav {
    display: flex;
    gap: 1rem;
  }
  </style>