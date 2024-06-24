<template>
<v-dialog v-model="dialogVisible" @afterLeave="closeDialog" max-width="800" >
    <v-card>
        <v-col>
            <v-row>
                <v-spacer/>
                <h1>Modifier une plage horaire</h1>
                <v-spacer/>
            </v-row>
            <v-row>
                <v-time-picker format="24hr" no-header v-model="startTime"/>
                <v-spacer/>
                <v-time-picker format="24hr" no-header v-model="endTime"/>
            </v-row>
            <v-row>
                <v-spacer/>
                <v-btn @click="save">Enregistrer</v-btn>
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
        // console.log(JSON.stringify(this.calendarEvent));
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
    console.log("event : "+JSON.stringify(event)+", end : "+event.end);
    return getTime(event.end);
  }

  function getTime(dateTime)
  {
    const dateObj = new Date(dateTime);

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    console.log("dateTime : "+dateTime+", obj : "+JSON.stringify(dateObj));

    return timeString;
  }

  </script>
  
  <style scoped>
    .dialog-center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Full height of viewport */
    }
  </style>