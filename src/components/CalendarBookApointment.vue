<template>
  <div>
    <vue-cal
      style="height: 600px"
      :events="events"
      @event-click="onEventClick"
      class="custom-calendar"
      :locale="fr"

    />
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const fr = {
  "weekDays": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  "weekDaysShort": ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  "years": "Années",
  "year": "Année",
  "month": "Mois",
  "week": "Semaine",
  "day": "Jour",
  "today": "Aujourd'hui",
  "noEvent": "",
  "allDay": "Toute la journée",
  "deleteEvent": "Supprimer",
  "createEvent": "Créer un événement",
  "dateFormat": "D MMMM YYYY dddd"
};

export default {
  name: 'BookApointment',
  components: {
    VueCal
  },
  data() {
    return {
      events: [],
      fr
    };
  },
  methods: {
    onEventClick(event) {
      alert(`Vous avez cliqué sur l'événement : ${event.title}, qui commence à ${event.start}`);
    }
  },
  async mounted()
  {

  }
};
</script>

<style>
.apointment{
  color: white;
  background-color: black;
}
</style>