<template>
  <!-- <h1>Disponibilites</h1> -->
  <v-col>
    <v-row>
      <stepSelector v-model="time_step"></stepSelector>
    </v-row>
    <v-row>
      <vue-cal
        ref="vueCal"

        v-model:events="events"

        class="calendar vuecal--full-height-delete"
        :locale="fr"

        :time-from="minutes_debut"
        :time-to="minutes_fin"

        :time-step="60"

        :editable-events="{ title: false, drag: true, resize: true, delete: true, create: true }" 
        :dragToCreateEvent="true"
        :show-day-numbers="false"

        :disabled="sending||loading"

        @event-click="eventClicked"
        @event-drag-create="eventCreated"

        @event-drop="eventDropped"
        @event-duration-change="eventDurationChanged"
        @event-delete="eventDeleted"

        :minDate="minDate"
        :maxDate="maxDate"
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
      <v-btn color="yellow-darken-4" :disabled="sending||loading||!changed" @click="reset">Réinitialiser</v-btn>
      <v-spacer/>
      <v-btn color="primary" :disabled="sending||loading||!changed" @click="save">Sauvegarder</v-btn>
      <v-spacer/>
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

<style scoped>
  /* this doesnt work for some reason */
  .calendar .vuecal__arrow--next,
  .calendar .vuecal__arrow--prev {
    display: none !important;
  }

  :deep(.calendar  .vuecal__event) {
    background-color: green;
    border: 1px solid rgb(5, 99, 0);
    color: white;
  }


  .calendar {
    height: 500px;
  }
</style>


<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import SettingsService from '../../services/SettingsService';
import {mapState} from 'vuex'
import modifyDialog from './AvailabilityWeekPlanningModifyDialog'
// import applyPatern from './AvailabilityWeekPlanningApply.vue'
import openSpansService from '@/services/OpenSpansService';
import stepSelector from '@/components/Utility/TimeStepSelector.vue'


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
    // applyPatern,
    stepSelector
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
      sending:false,
      changed:false,
      minDate:new Date(),
      maxDate:new Date()
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
    eventCreated(event)
    {
      // console.log("created an event : "+JSON.stringify(event));
      this.changed = true
      this.applyStep(event)

      this.events.push(event)

      this.mergeOverlapping(event)
      this.formatEvents()
      // return false
    },
    async load(){
      this.heure_debut = await SettingsService.getSetting("heure_debut_calendrier")
      this.heure_fin = await SettingsService.getSetting("heure_fin_calendrier")
      this.minutes_debut = getMinutes(this.heure_debut)
      this.minutes_fin = getMinutes(this.heure_fin)
      // console.log("session : "+this.session);
      this.events = await openSpansService.getSpans(this.session)

      this.minDate = new Date()
      this.minDate.setHours(0,0,0,0)
      this.minDate.setDate(this.minDate.getDate())
      const nbDays = await SettingsService.getSetting("duree_planification")

      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + nbDays);
      
      this.maxDate = maxDate
      maxDate.setHours(0,0,0,0)

      this.loading = false
    },
    eventDropped(req,applyStep=true){
      this.changed = true;

      let originalEvent = req.originalEvent;
      let updatedEvent = req.event;

      if(applyStep)
      {
        this.applyStep(updatedEvent)
      }


      // updatedEvent = this.getSteppedEvent(updatedEvent)

      // console.log("original event : "+JSON.stringify(originalEvent));
      const eventIndex = this.events.findIndex(arrayEvent => {
        // console.log("arrayEvent : \n"+arrayEvent.start+",\n "+arrayEvent.end);
        const originalStart = new Date(originalEvent.start)
        const originalEnd = new Date(originalEvent.end)
        // console.log("originalEvent : \n"+originalStart+",\n "+originalEnd);
        // console.log();
        return arrayEvent.start.getTime() === originalStart.getTime() && arrayEvent.end.getTime() === originalEnd.getTime()
      }
      );

      // console.log("res : "+eventIndex);

      if (eventIndex !== -1) {
          if(updatedEvent==null)
          {
            this.events.splice(eventIndex,1)
            // console.log("Event deleted");
          }
          else
          {
            this.events[eventIndex] = updatedEvent;
            this.mergeOverlapping(updatedEvent)
            // console.log("Event found and updated");
          }
          this.formatEvents()
      } else {
          // console.log("Event not found.");
      }

      // this.delete(updatedEvent)
      // const steppedEvent = this.getSteppedEvent(updatedEvent)
      // this.events.push(steppedEvent)
    },
    eventDurationChanged(req)
    {
      this.changed=true
      let {event} = req;

      // const steppedEvent = this.getSteppedEvent(event)
      // this.delete(event)
      // this.events.push(steppedEvent)

      // event = steppedEvent
      this.applyStep(event)
      
      this.mergeOverlapping(event)
      this.formatEvents()
    },
    eventDeleted(event)
    {
      this.changed = true;
      const index = this.events.findIndex(arrayEvent =>{
        return arrayEvent.start.getTime()==event.start.getTime() &&
        arrayEvent.end.getTime() == event.end.getTime()
      })
      if(index <= -1)
      {
        throw new Error("couldnt find event : "+JSON.stringify(event))
      }

      this.events.splice(index,1)
    },
    updateCalendarEvent(originalEvent, updatedEvent) {
      const req = {
        event:updatedEvent,
        originalEvent:originalEvent
      }
      this.eventDropped(req,false)
  },
  async save(){
    this.sending = true
    // await WeekPlanningService.setPlagesHoraires(this.session,this.events)
    // const nbDaysPlanification = await SettingsService.getSetting("duree_planification")
    // var start = new Date();

    // var end = new Date(start)

    // end.setDate(end.getDate()+nbDaysPlanification)


    // start = formatDate(start)
    // end = formatDate(end)

    const start = '1970-01-01'
    const end = '9999-01-01'
    // console.log("start : "+start+", end : "+end);


    // const spans = toSpans(this.events)

    await openSpansService.setSpans(this.session,start,end,this.events)

    // console.log("set spans !");
    // await new Promise(resolve => setTimeout(resolve, 1000));
    this.changed = false
    this.sending = false
  },
  empty(){
    // console.log(JSON.stringify(this.events));
    this.changed=true
    this.events = []
  },
  // async logEvents(){
  //   console.log(JSON.stringify(this.events));
  // },
  async reset(){
    this.events = await openSpansService.getSpans(this.session)
    this.changed = false
  },
  applyStep(event){
    // console.log("applying step ..."+JSON.stringify(event));
    var start = event.start
    var end = event.end

    const newMinStart = Math.round(start.getMinutes()/this.time_step)*this.time_step
    const newMinEnd = Math.round(end.getMinutes()/this.time_step)*this.time_step

    start.setMinutes(newMinStart)
    end.setMinutes(newMinEnd)

    event.start = start
    event.end = end
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
  getSteppedEvent(event)
  {
    let startMin = event.start.getMinutes()
    startMin = Math.round(startMin / this.time_step) * this.time_step;

    let endMin = event.end.getMinutes()
    endMin = Math.round(endMin / this.time_step) * this.time_step;

    const newStart = new Date( event.start )
    newStart.setMinutes(startMin)
    const newEnd = new Date( event.end )
    newEnd.setMinutes(endMin)

    const newEvent = {
      class: 'apointment',
      start: newStart,
      end: newEnd,
    }

    console.log("stepped event to "+this.time_step+" : "+JSON.stringify(newEvent));

    return newEvent
  },
  mergeOverlapping(event)
  {
    this.deleteNonUniques()
    const otherOverlapping = this.getOverlapping(event)

    let startTime = event.start.getTime()
    let endTime = event.end.getTime()

    // console.log("other overlapping : "+JSON.stringify(otherOverlapping));

    for (let i = 0; i < otherOverlapping.length; i++) {
      const element = otherOverlapping[i];
      if(element.start.getTime()<startTime)
        startTime = element.start.getTime()
      if(element.end.getTime()>endTime)
        endTime = element.end.getTime()
      this.delete(element)
    }
    const start = new Date(startTime) 
    const end = new Date(endTime) 
    // console.log("start : "+start+", end : "+end);



    const index = this.events.findIndex(arrayEvent =>{
      return arrayEvent.start.getTime()==event.start.getTime() && 
      arrayEvent.end.getTime()==event.end.getTime()
    })
    if(index<=-1)
    {
      throw new Error("could not find "+JSON.stringify(event)+" in this.events")
    }
    this.events.splice(index,1)

    // console.log("index : "+index);

    const newEvent = {
      class: 'apointment',
      start: start,
      end: end,
    }

    this.events.push(newEvent)

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
      if(arrayEvent.start.getTime()==event.start.getTime() && arrayEvent.end.getTime() == event.end.getTime())
      {
        // console.log("found and deleting");
        this.events.splice(i,1);
        return
      }
    }
    // console.log("could not delete");
  },
  async revertChangesAndApply()
  {
    await this.reset()
    this.$refs.applyPatern.applyPatern()
  },
  applyChangesAndApply()
  {
    this.save()
    this.$refs.applyPatern.applyPatern()
  }
  }
  ,async mounted()
  {
    await this.load()
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
  .availability-calendar  .vuecal__event {
    background-color: green;
    color: white;
  }

  .availability-calendar {
    height: 500px;
  }
  /* .vuecal + .vuecal .vuecal__arrow {display: none;} */
</style>

  