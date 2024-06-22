<template>
  <div id="app">
    <!-- Pass isLoggedIn state to Navbar component -->
    <Navbar :isLoggedIn="isLoggedIn" @logout="logout" />

    <!-- Router view for rendering components based on routes -->
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      isLoggedIn: false // Initially assuming user is not logged in
    };
  },
  methods: {
    login() {
      // Simulate login logic
      this.isLoggedIn = true;
    },
    logout() {
      // Simulate logout logic
      this.isLoggedIn = false;
    }
  }
};
</script>

<style>
/* Add your global styles here */
/* No changes needed in global styles for this example */
</style>