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
        :show-date="false"

        :selected-date="new Date('1970-01-05')"
        :min-date="new Date('1970-01-05')"
        :max-date="new Date('1970-01-11')"

        :time-from="minutes_debut"
        :time-to="minutes_fin"

        :time-step="60"
        :overlaps-per-time-step="true"

        :editable-events="{ title: false, drag: true, resize: true, delete: true, create: true }" 
        :dragToCreateEvent="true"
        :show-day-numbers="false"

        :on-event-click="onEventClicked"
        :on-event-create="onEventCreated"
        />

    </v-row>
  </v-col>

  <modifyDialog :open="dialogVisible" @close="dialogVisible = false" :calendarEvent="selectedEvent"/>

  

</template>
  
  <script>
  import VueCal from 'vue-cal';
  import modifyDialog from './AvailabilityWeekPlanningModifyDialog'
  import 'vue-cal/dist/vuecal.css';
  import SettingsService from '../services/SettingsService';

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
    name: 'CalendarComponent',
    components: {
      VueCal,
      modifyDialog
    },
    data() {
      return {
        events: [],
        fr,
        time_step:1,
        dialogVisible:false,
        selectedEvent:{},
        heure_debut:"8:00",//loaded from mounted
        heure_fin:"18:00",//loaded from mounted
        minutes_debut:480,//loaded from mounted
        minutes_fin:1080//loaded from mounted
      };
    },
    computed:{

    },
    methods: {
      onEventCreated(event)
      {
        this.events.push(event)

        return event
      },
      onEventClicked(event)
      {
        // console.log("event : "+JSON.stringify(event));
        this.dialogVisible = true
        this.selectedEvent = event
      },
      async loadSettings(){
        this.heure_debut = await SettingsService.getSetting("heure_debut_calendrier")
        this.heure_fin = await SettingsService.getSetting("heure_fin_calendrier")
        this.minutes_debut = getMinutes(this.heure_debut)
        this.minutes_fin = getMinutes(this.heure_fin)     
        this.loading = false
      }
      ,hideDayNumbers(){
        const elements = document.querySelectorAll('.vuecal__flex.weekday-label');

        elements.forEach(element => {
            const spans = element.getElementsByTagName('span');
            if (spans.length >= 4) {
                spans[3].style.display = 'none';
            }
        });
      }
    }
    ,async mounted()
    {
        await this.loadSettings()
        this.hideDayNumbers()
    },
  };

  function getMinutes(time)
  {
    let [h,m] = time.split(":")
    h = parseInt(h)
    m = parseInt(m)

    return 60*h+m;
  }

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

  