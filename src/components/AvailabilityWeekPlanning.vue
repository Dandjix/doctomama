<template>
  <h1>Planning hebdomadaire</h1>
  <v-col>
    <v-row>
      <stepSelector v-model="time_step"></stepSelector>
    </v-row>
    <v-row>
      <vue-cal
        ref="vueCal"

        v-model:events="events"

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

        @event-click="eventClicked"
        @event-duration-change="eventDurationChanged"
        />

    </v-row>
    <v-row>
      <v-spacer/>
      <v-btn color="red" @click="reset">Réinitialiser</v-btn>
      <v-spacer/>
    </v-row>
  </v-col>

  <modifyDialog :open="dialogVisible" 
  @close="dialogVisible = false" 
  :calendarEvent="selectedEvent"
  :minTime="heure_debut"
  :maxTime="heure_fin"
  @update-calendar-event="updateCalendarEvent"
  />

  

</template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import SettingsService from '../services/SettingsService';

  import modifyDialog from './AvailabilityWeekPlanningModifyDialog'
  import stepSelector from './TimeStepSelector.vue'


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
      modifyDialog,
      stepSelector
    },
    data() {
      return {
        events: [],
        events_2_electric_boogaloo: [],
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
      eventCreated(event)
      {
        // this.events.push(event)
        // console.log("deleter : "+JSON.stringify(deleteEventFunction));
        // deleteEventFunction()
        return event
        // return false
      },
      eventClicked(event)
      {
        // console.log("event : "+JSON.stringify(event));
        this.dialogVisible = true
        this.selectedEvent = event
      },
      eventChanged(req)
      {
        const event = req.event;

        const event_id = this.events_2_electric_boogaloo.findIndex(arrayEvent =>{
          return arrayEvent._eid == event._eid;
        });
        if(event_id<=-1)
        {
          this.events_2_electric_boogaloo.push(event)
          return
        }
        this.events_2_electric_boogaloo[event_id] = event
      },
      eventDeleted(event){
        const index = this.events_2_electric_boogaloo.find(arrayEvent => {
          arrayEvent._eid==event._eid
        })
        if(index<=-1)
        {
          throw new Error("impossible de trouver cet évenement!")
        }
        this.events_2_electric_boogaloo.splice(index,1)
      },
      applyEvents()
      {
        this.events = [...this.events_2_electric_boogaloo]
      }
      ,
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
      },
      updateCalendarEvent(originalEvent, updatedEvent) {
        // console.log("updated event from : " + JSON.stringify(originalEvent) + " to : " + JSON.stringify(updatedEvent));
        // Find the index of the original event in the list
        const eventIndex = this.events.findIndex(event => {
          // console.log("event start : "+event.start);
          // console.log("event end : "+event.end);
          // console.log();
          return event.start === originalEvent.start && event.end === originalEvent.end
        }

        );

        // console.log("original event start : "+originalEvent.start);
        // console.log("original event end : "+originalEvent.end);
        // console.log();

        // If the event is found, replace it with the updated event
        if (eventIndex !== -1) {
            // const newEvents = [...this.events]
            this.events_2_electric_boogaloo[eventIndex] = updatedEvent;
            // this.events = newEvents;
            // this.events = this.events
            // this.events.slice(eventIndex,1)
            console.log("Event updated successfully.");
        } else {
            console.log("Event not found.");
        }
        this.applyEvents()
        // console.log("events : " + JSON.stringify(this.events));
    },
    reset(){
      // this.getAllEvents()
      console.log("events var : "+JSON.stringify(this.events_2_electric_boogaloo));
    },
    getAllEvents() {
      const allEvents = this.$refs.vueCal.events;
      console.log(allEvents);
      alert(JSON.stringify(allEvents));
    },
    // eventDurationChanged(result){
    //   // console.log("result : "+JSON.stringify(result));
    // }
    }
    ,async mounted()
    {
      if(this.$refs.vueCal)
      {
        console.log("vuecal can be gotten");
      }
      else
      {
        console.log("not fine");
        console.log(JSON.stringify(this.$refs));
      }
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

  