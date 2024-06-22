<template>
  <div>
    <div class="button-bar">
      <v-btn>button</v-btn>
      <button @click="selectedComponent = 'CalendarModifyAvailability'"><img v-bind:src="require('/src/assets/disponibilites.png')" alt="Modifier mes disponibilités"></button>
      <button @click="selectedComponent = 'CalendarWeekPlanning'"><img v-bind:src="require('/src/assets/edt.png')" alt="Modifier mon emploi du temps par semaine"></button>
      <button @click="selectedComponent = 'CalendarPlanVacations'"><img v-bind:src="require('/src/assets/vacances.png')" alt="Planifier mes vacances"/></button>
    </div>

    <div class="component-display">
      <!-- Dynamically render selected component -->
      <component :is="selectedComponent" />
    </div>
  </div>
</template>

<script>

import CalendarModifyAvailability from '../components/CalendarModifyAvailability.vue';
import CalendarPlanVacations from '../components/CalendarPlanVacations.vue';
import CalendarWeekPlanning from '../components/CalendarWeekPlanning.vue';

export default {
  name: 'PlannifierDisponibilites',
  components: {
    CalendarModifyAvailability,
    CalendarPlanVacations,
    CalendarWeekPlanning
  },
  data() {
    return {
      selectedComponent: 'CalendarModifyAvailability' // Default component to display
    };
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
.button-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.component-display {
  /* Add styles if needed */
}
</style>