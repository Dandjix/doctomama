<template>

  <div>

    <v-app-bar class="toolbar">

    <!-- <v-toolbar-items class="toolbar-items">
        <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarModifyAvailability' }"
          class="button-image_button"  
          @click="selectedComponent = 'CalendarModifyAvailability'" >

        <img v-bind:src="require('/src/assets/disponibilites.png')" alt="Modifier mes disponibilités" class="button-image_image"/>
        </v-btn>

        <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarWeekPlanning' }"
          class="button-image_button" 
          @click="selectedComponent = 'CalendarWeekPlanning'">

          <img v-bind:src="require('/src/assets/edt.png')" alt="Modifier mon emploi du temps par semaine" class="button-image_image"/>
        </v-btn>

        <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarPlanVacations' }"
          class="button-image_button" @click="selectedComponent = 'CalendarPlanVacations'">
          <img v-bind:src="require('/src/assets/vacances.png')" alt="Planifier mes vacances" class="button-image_image"/>
        </v-btn> 

        <v-btn 
          :class="{ 'active': selectedComponent === 'AvailabilitySettings' }"
          class="button-image_button" @click="selectedComponent = 'AvailabilitySettings'">
          <img v-bind:src="require('/src/assets/settings.png')" alt="Options" class="button-image_image"/>
        </v-btn> 

    </v-toolbar-items> -->

    <v-btn-toggle>
      <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarModifyAvailability' }"
          class="button-image_button"  
          @click="selectedComponent = 'CalendarModifyAvailability'" >

        <img v-bind:src="require('/src/assets/disponibilites.png')" alt="Modifier mes disponibilités" class="button-image_image"/>
        </v-btn>

        <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarWeekPlanning' }"
          class="button-image_button" 
          @click="selectedComponent = 'CalendarWeekPlanning'">

          <img v-bind:src="require('/src/assets/edt.png')" alt="Modifier mon emploi du temps par semaine" class="button-image_image"/>
        </v-btn>

        <v-btn 
          :class="{ 'active': selectedComponent === 'CalendarPlanVacations' }"
          class="button-image_button" @click="selectedComponent = 'CalendarPlanVacations'">
          <img v-bind:src="require('/src/assets/vacances.png')" alt="Planifier mes vacances" class="button-image_image"/>
        </v-btn> 

        <v-btn 
          :class="{ 'active': selectedComponent === 'AvailabilitySettings' }"
          class="button-image_button" @click="selectedComponent = 'AvailabilitySettings'">
          <img v-bind:src="require('/src/assets/settings.png')" alt="Options" class="button-image_image"/>
        </v-btn> 
    </v-btn-toggle>
  </v-app-bar>
    <div class="component-display">
      <!-- Dynamically render selected component -->
      <component :is="selectedComponent" />
    </div>
  </div>

</template>

<script>

import CalendarModifyAvailability from '../components/AvailabilityModifyAvailability.vue';
import CalendarPlanVacations from '../components/AvailabilityPlanVacations.vue';
import CalendarWeekPlanning from '../components/AvailabilityWeekPlanning.vue';
import AvailabilitySettings from '../components/AvailabilitySettings.vue'

export default {
  name: 'PlannifierDisponibilites',
  components: {
    CalendarModifyAvailability,
    CalendarPlanVacations,
    CalendarWeekPlanning,
    AvailabilitySettings
  },
  data() {
    return {
      selectedComponent: 'CalendarModifyAvailability' // Default component to display
    };
  }
};
</script>

<style scoped>
.toolbar {
  height: auto; /* Adjust as needed */
}

.toolbar-items {
  display: flex;
  align-items: center; /* Vertical alignment */
  justify-content: flex-start; /* Horizontal alignment */
  height: 100%; /* Adjust as needed */
  padding: 0 20px; /* Adjust padding as needed */
}

.button-image_image {
  height: 50px; /* Adjust image height */
  width: auto; /* Maintain aspect ratio */
}

.button-image_button {
  background-color: rgb(202, 202, 202);
  height: 80px; /* Adjust button height */
  min-width: 120px; /* Minimum button width */
  margin-right: 10px; /* Adjust margin between buttons */
}

.button-image_button.active {
  background-color: black;
}
</style>