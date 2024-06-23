<template>
    <h1>Planning hebdomadaire</h1>
    <v-col>
      <v-row>
        <vue-cal
          :events="events"
          class="week-planning-calendar vuecal--full-height-delete"
          :locale="fr"
          :first-day="0"   
          :disable-views="['years', 'year', 'month', 'day']" 
          hide-view-selector
          hide-title-bar 
          :show-date="true"
          :editable-events="{ title: false, drag: false, resize: true, delete: true, create: true }" 
          :drag-to-create-threshold="0"

          :time-from="8 * 60"
          :time-to="19 * 60"
          :time-step="60"
          />
      </v-row>
    </v-col>

</template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import StepSelector from '.'
  
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
    "noEvent": "Aucun événement",
    "allDay": "Toute la journée",
    "deleteEvent": "Supprimer",
    "createEvent": "Créer un événement",
    "dateFormat": "D MMMM YYYY dddd"
  };
  
  export default {
    name: 'CalendarComponent',
    components: {
      VueCal
    },
    data() {
      return {
        events: [],
        fr,
        time_step:60
      };
    },
    methods: {
      // onEventClick(event) {
      //   alert(`Vous avez cliqué sur l'événement : ${event.title}, qui commence à ${event.start}`);
      //   showPopupAt(event)
      // },
    }
  };
  </script>

<style>
  /* this doesnt work for some reason */
  .week-planning-calendar .vuecal__arrow--next,
  .week-planning-calendar .vuecal__arrow--prev {
    display: none !important;
  }

  .week-planning-calendar  .vuecal__event {
    background-color: green;
    color: white;
  }

  .week-planning-calendar {
    height: 500px;
  }
  /* .vuecal + .vuecal .vuecal__arrow {display: none;} */
</style>

  