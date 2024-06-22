<template>
    <h1>planifier mes vancances</h1>
    <div>
      <vue-cal
        style="height: 600px"
        :events="events"
        @event-click="onEventClick"
        @cell-click="onCellClick"
        class="custom-calendar"
        :locale="fr"
      />
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  
  const fr = {
    "weekDays": ["1er lundi", "2e mardi", "3e mercredi", "4e jeudi", "5e vendredi", "6e samedi", "7e dimanche"],
    "weekDaysShort": ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"],
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
        fr
      };
    },
    methods: {
      onEventClick(event) {
        alert(`Vous avez cliqué sur l'événement : ${event.title}, qui commence à ${event.start}`);
      },
      onCellClick(date) {
        const title = prompt('Entrez le titre du rendez-vous :');
        //if (title) {
          // Calculate end time as 1 hour after start time
          const endTime = new Date(date);
          endTime.setHours(endTime.getHours() + 1);
  
          this.events.push({
            class: 'apointment',
            start: date,
            end: endTime,
            title
          });
        //}
      }
    }
  };
  </script>