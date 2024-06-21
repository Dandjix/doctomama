<template>
  <div>
    <h1>Prendre rendez-vous</h1>
    <CalendarComponent />
  </div>
</template>

<script>
import CalendarComponent from '../components/CalendarComponent.vue';
export default {
  name: 'Prendre Rendez-Vous',
  components: {
    CalendarComponent  // Register the CalendarComponent locally
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>