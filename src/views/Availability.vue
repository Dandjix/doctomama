<template>
  <div>
    <div class="button-bar">
      <button @click="selectedComponent = 'CalendarModifyAvailability'"><img src="" alt="Modifier mes disponibilités"></button>
      <button @click="selectedComponent = 'CalendarWeekPlanning'"><img src="" alt="Modifier mon emploi du temps par semaine"></button>
      <button @click="selectedComponent = 'CalendarPlanVacations'"><img src="" alt="Planifier mes vacances"></button>
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
import CalendarWeekPlanning from '../components/CalendarPlanVacations.vue';

export default {
  name: 'PlannifierDisponibilites',
  components: {
    CalendarModifyAvailability,
    CalendarPlanVacations,
    CalendarWeekPlanning
  },
  data() {
    return {
      selectedComponent: 'CalendarComponent' // Default component to display
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