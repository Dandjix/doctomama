<!-- src/App.vue -->
<template>
    <div id="app">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/book-rdv">Book an Appointment</router-link>
      </nav>
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'App'
  };
  </script>
  
  <style>
  /* Add your global styles here */
  nav {
    display: flex;
    gap: 1rem;
  }
  </style>