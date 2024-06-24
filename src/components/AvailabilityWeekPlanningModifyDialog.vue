<template>
<v-dialog v-model="dialogVisible" @afterLeave="closeDialog" max-width="800" >
    <v-card class="card">
        <v-col>
            <v-row>
                <v-spacer/>
                <h1>Modifier une plage horaire</h1>
                <v-spacer/>
            </v-row>
            <v-row>
                <v-time-picker format="24hr" no-title title="Heure de début de la plage horaire" v-model="startTime" :min="minTime" :max="endTime"   />
                <v-spacer/>
                <v-time-picker format="24hr" no-title title="Heure de fin de la plage horaire" v-model="endTime" :min="startTime" :max="maxTime"/>
            </v-row>
            <v-row>
                <v-spacer/>
                <v-btn @click="save" color="primary">Enregistrer</v-btn>
                <v-spacer/>
            </v-row>
        </v-col>

    </v-card>

</v-dialog>
</template>

  <script>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'

  export default {
    components:{
        VTimePicker
    },
    props: {
      open: {
        type: Boolean,
        required: true
      },
      calendarEvent: {
        type: Object,
        default: null
      },
      minTime:{
        type: String,
        default:"08:00"
      },
      maxTime:{
        type: String,
        default:"18:00"
      }
    },
    data() {
      return {
        dialogVisible: false,
        startTime:"08:00",
        endTime:"18:00"
      };
    },
    watch: {
      open(newVal) {
        this.dialogVisible = newVal;
        this.startTime = getStartTime(this.calendarEvent)
        this.endTime = getEndTime(this.calendarEvent)
      }
    },
    methods: {
      closeDialog() {
        this.dialogVisible = false;
        this.$emit('close'); // Emit close calendarEvent to notify parent
      },
      save(){

        const [startHours, startMinutes] = this.startTime.split(':').map(Number);
        const [endHours, endMinutes] = this.endTime.split(':').map(Number);


        const updatedCalendarEvent = { ...this.calendarEvent };

        const updatedStart = new Date(updatedCalendarEvent.start);
        updatedStart.setHours(startHours);
        updatedStart.setMinutes(startMinutes);
        
        const updatedEnd = new Date(updatedCalendarEvent.end);
        updatedEnd.setHours(endHours);
        updatedEnd.setMinutes(endMinutes);


        updatedCalendarEvent.start = updatedStart;
        updatedCalendarEvent.end = updatedEnd;
        updatedCalendarEvent.startTimeMinutes = startHours*60+startMinutes;
        updatedCalendarEvent.endTimeMinutes = endHours*60+endMinutes;


        // console.log("updated end : " + updatedCalendarEvent.end);

        this.$emit('update-calendar-event', this.calendarEvent,updatedCalendarEvent);

        this.closeDialog();
      }
    }
  };

  function getStartTime(event)
  {
    return getTime(event.start);
  }

  function getEndTime(event)
  {
    // console.log("event : "+JSON.stringify(event)+", end : "+event.end);
    return getTime(event.end);
  }

  function getTime(dateTime)
  {
    const dateObj = new Date(dateTime);

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // console.log("dateTime : "+dateTime+", obj : "+JSON.stringify(dateObj));

    return timeString;
  }

  </script>
  
  <style scoped>
    .card{
      padding:25px;
    }

    .dialog-center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Full height of viewport */
    }
  </style>