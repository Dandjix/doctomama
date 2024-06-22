<template>
  <nav>
    <div v-if="isLoggedIn">
      <router-link to="/">Page d'accueil</router-link>
      <router-link to="/availability">Modifier mes disponibilités </router-link>
      <button @click="logout">Se déconnecter</button>
    </div>
    <div v-else-if="currentRoute === '/login'">
      <router-link to="/">Page d'accueil</router-link>
    </div>
    <div v-else>
      <router-link to="/">Page d'accueil</router-link>
      <router-link to="/book-rdv">Prendre rendez-vous</router-link>
    </div>
  </nav>
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