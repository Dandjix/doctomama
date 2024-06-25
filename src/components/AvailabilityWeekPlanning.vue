<template>
  <h1>Planning hebdomadaire</h1>
  <v-col>
    <!-- <v-row>
      <stepSelector v-model="time_step"></stepSelector>
    </v-row> -->
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

        :editable-events="{ title: false, drag: false, resize: false, delete: false, create: false }" 
        :dragToCreateEvent="false"
        :show-day-numbers="false"

        :disabled="sending||loading"

        @event-click="eventClicked"
        @cell-click="cellClicked"
        />

    </v-row>
    <v-row>
      <v-spacer/>
      <v-progress-circular v-if="sending" class="spinner" indeterminate :size="30"></v-progress-circular>
      <v-spacer/>
    </v-row>
    <v-row>
      <v-spacer/>
      <v-spacer/>
      <v-btn color="red" :disabled="sending||loading" @click="reset">Réinitialiser</v-btn>
      <v-spacer/>
      <v-btn color="primary" :disabled="sending||loading" @click="save">Sauvegarder</v-btn>
      <v-spacer/>
      <v-spacer/>
    </v-row>
    <v-row style="padding: 50px;">
      <v-spacer></v-spacer>
      <v-card>
        <v-card-title>Mode d'emploi</v-card-title>
        <v-card-text>
          Définissez votre emploi du temps, qui sera appliqué à chaque nouvelle semaine au fil du temps (définissez la longueur de votre calendrier dans les options).
          <br>
          Vous pouvez aussi appliquer cet emploi du temps à plusieurs semaines via la page modifier disponibilités (icone horloge).
        </v-card-text>
      </v-card>
      <v-spacer></v-spacer>
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
  import WeekPlanningService from '@/services/WeekPlanningService';
  import {mapState} from 'vuex'
  import modifyDialog from './AvailabilityWeekPlanningModifyDialog'
  // import stepSelector from './TimeStepSelector.vue'


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
      // stepSelector
    },
    data() {
      return {
        events: [],//loaded from mounted
        fr,
        time_step:1,
        dialogVisible:false,
        selectedEvent:{},
        heure_debut:"8:00",//loaded from mounted
        heure_fin:"18:00",//loaded from mounted
        minutes_debut:480,
        minutes_fin:1080,
        loading:true,
        sending:false
      };
    },
    computed:{
      ...mapState(['session'])
    },
    methods: {
      eventClicked(event)
      {
        if(this.sending||this.loading)
          return
        // console.log("event : "+JSON.stringify(event));
        this.dialogVisible = true
        this.selectedEvent = event
      },
      cellClicked(date)
      {
        if(this.sending||this.loading)
          return
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + 1);

        const event = {
          class: 'apointment',
          start: date,
          end: endTime,
        }
        this.events.push(event);
        this.mergeOverlapping(event)
        this.formatEvents()
      },
      async load(){
        this.heure_debut = await SettingsService.getSetting("heure_debut_calendrier")
        this.heure_fin = await SettingsService.getSetting("heure_fin_calendrier")
        this.minutes_debut = getMinutes(this.heure_debut)
        this.minutes_fin = getMinutes(this.heure_fin)
        // console.log("session : "+this.session);
        this.events = await WeekPlanningService.getPlagesHoraires(this.session)


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
        // console.log("original event : "+JSON.stringify(originalEvent));
        const eventIndex = this.events.findIndex(arrayEvent => {
          return arrayEvent.start === originalEvent.start && arrayEvent.end === originalEvent.end
        }
        );

        if (eventIndex !== -1) {
            if(updatedEvent==null)
            {
              this.events.splice(eventIndex,1)
            }
            else
            {
              this.events[eventIndex] = updatedEvent;
              this.mergeOverlapping(updatedEvent)
            }
            this.formatEvents()
        } else {
            // console.log("Event not found.");
        }

    },
    async save(){
      this.sending = true
      await WeekPlanningService.setPlagesHoraires(this.session,this.events)
      // await new Promise(resolve => setTimeout(resolve, 1000));
      this.sending = false
    },
    reset(){
      console.log(JSON.stringify(this.events));
      this.events = []
    },
    formatEvents() {
      // console.log("formatting events");
      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i];
        const startHour = `${event.start.getHours()}:${event.start.getMinutes()}`
        const endHour = `${event.end.getHours()}:${event.end.getMinutes()}`
        if(compareHours(startHour,this.heure_debut)){
          event.start = getCopiedDateWithTime(event.start,this.heure_debut)
        }

        if(compareHours(this.heure_fin,endHour)){
          event.end = getCopiedDateWithTime(event.end,this.heure_fin)
        }

      }
    },
    deleteNonUniques()
    {
      let uniqueEvents = [];
      let encounteredEvents = new Set();

      // Iterate through each event
      for (let event of this.events) {
          // Create a unique key based on start and end times
          let key = `${event.start}-${event.end}`;

          // Check if this key has been encountered before
          if (!encounteredEvents.has(key)) {
              // If not encountered, add the event to uniqueEvents
              uniqueEvents.push(event);

              // Mark this key as encountered
              encounteredEvents.add(key);
          }
          // If the key has been encountered, skip adding this event
      }

      // Now uniqueEvents array contains only unique events
      this.events = uniqueEvents;
    },
    mergeOverlapping(event)
    {
      this.deleteNonUniques()
      const otherOverlapping = this.getOverlapping(event)

      let start = event.start
      let end = event.end

      for (let i = 0; i < otherOverlapping.length; i++) {
        const element = otherOverlapping[i];
        if(element.start<start)
          start = element.start
        if(element.end>end)
          end = element.end
        this.delete(element)
      }
      event.start = start
      event.end = end
    },
    getOverlapping(event)
    {
      let overlapping = []
      for (let i = 0; i < this.events.length; i++) {
        const otherEvent = this.events[i];
        const isThis = otherEvent.start==event.start && otherEvent.end == event.end;
        if(isThis)
          continue
        // if(otherEvent.start)
        // console.log("date : "+otherEvent.start+"type : "+typeof otherEvent.start)
        const areOverlapping = (event.start <= otherEvent.start && otherEvent.start <= event.end) ||
                    (event.start <= otherEvent.end && otherEvent.end <= event.end);
        if(areOverlapping)
          overlapping.push(otherEvent)
        // console.log("comp : "+overlapping);
        // overlapping

        // console.log("element is this event ? : "+isThis);
      }
      return overlapping
    },
    delete(event)
    {
      for (let i = 0; i < this.events.length; i++) {
        const arrayEvent = this.events[i];
        if(arrayEvent.start==event.start && arrayEvent.end == event.end)
        {
          this.events.splice(i,1);
          return
        }
      }
    }
    }
    ,async mounted()
    {
      await this.load()
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
  function getCopiedDateWithTime(date,time)
  {
    //copy the date
    const copiedDate = new Date(date);
    const [hours,minutes] = time.split(':')
    copiedDate.setHours(hours,minutes)

    return copiedDate
  }
  function compareHours(begin,end)
  {
    let [hourB,minB] = begin.split(":")
    let [hourE,minE] = end.split(":")
    hourB = parseInt(hourB)
    minB = parseInt(minB)
    hourE = parseInt(hourE)
    minE = parseInt(minE)

    if(hourB<hourE){
      return true
    }
    if(hourB>hourE){
      return false
    }
    return minB<minE
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

  