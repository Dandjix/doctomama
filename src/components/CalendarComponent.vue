<template>
  <div>
    <vue-cal
      style="height: 600px"
      :events="events"
      @event-click="onEventClick"
      @cell-click="onCellClick"
      class="custom-calendar"
    />
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  name: 'CalendarComponent',
  components: {
    VueCal
  },
  data() {
    return {
      events: [],
      days:["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
    };
  },
  methods: {
    onEventClick(event) {
      alert(`Vous avez cliqué sur l'événement : ${event.title}`);
    },
    onCellClick(date) {
      const title = prompt('Entrez le titre du rendez-vous :');
      if (title) {
        // Calculate end time as 1 hour after start time
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + 1);

        this.events.push({
          class: 'apointment',
          start: date,
          end: endTime,
          title
        });
      }
    }
  }
};
</script>

<style>
.apointment{
  color: white;
  background-color: black;
}
</style>