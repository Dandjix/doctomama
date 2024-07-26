<template>
  <v-app-bar app>
    <v-toolbar-title>
      <router-link to="/">Page d'accueil</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      
      <v-btn to="/test">Test</v-btn>

      <template v-if="isLoggedIn">
        <v-btn to="/whitelist">Enregistrer des patient·e·s</v-btn>
        <v-btn to="/availability">Modifier mes disponibilités</v-btn>
        <v-btn @click="logout">Se déconnecter</v-btn>
      </template>
      <template v-else-if="currentRoute === '/login'">

      </template>
      <template v-else>
        <v-btn to="/bookApointment">Prendre rendez-vous</v-btn>
      </template>




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