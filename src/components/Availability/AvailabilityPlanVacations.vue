<template>

  <ChangesSnackbar v-model="snackbar" :message="snackbarMessage"></ChangesSnackbar>

    <v-col>
      <v-row>
        <v-spacer></v-spacer>
        <h1>planifier mes vancances</h1>
        <v-spacer></v-spacer>
      </v-row>

      <v-row>
        <v-spacer></v-spacer>
        <v-progress-circular v-if="sending||loading" indeterminate :size="30"></v-progress-circular>
        <v-spacer></v-spacer>
      </v-row>

      <v-row>
      <vue-cal
        style="height: 400px"
        :events="events"
        class="vacation-calendar"
        :locale="fr"
        @cell-click="toggleVacations"

        :time="false" active-view="week" :disable-views="['day']"
        :min-date="new Date()"
      />
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
        <v-btn color="red" @click="reset" :disabled="sending||loading||!changed">Réinitialiser</v-btn>
      <v-spacer></v-spacer>
        <v-btn color="primary" @click="save" :disabled="sending||loading||!changed">Sauvegarder</v-btn>
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" @click="log">Log</v-btn>
      <v-spacer></v-spacer> -->
    </v-row>

    </v-col>
    <v-row class="mt-10 mb-10">
      <v-divider thickness="3"></v-divider>
    </v-row>

    <AvailabilityApplyVacation @vacations-changed="appliedVacations" :vacations-changed="changed" :disabled="sending||loading"/>

    <!-- <ConfirmLeaveDialog
        v-model="leaveDialog"
        title="Attention : changements non enregistrés."
        message="Êtes vous sûr·e de vouloir quitter la page ?"
        @confirm="confirmLeave"
        @cancel="cancelLeave"
      ></ConfirmLeaveDialog> -->
  </template>
  
  <style scoped>
  >>>.vuecal__event.leisure {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}

  >>>.vuecal__cell-events-count {    background: #fd9c42;}

</style>


<script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import AvailabilityApplyVacation from './AvailabilityPlanVacationsApply.vue';
  // import ConfirmLeaveDialog from './ConfirmLeaveDialog.vue';
  import ChangesSnackbar from '@/components/Utility/ChangesSnackbar.vue'
  import vacationsService from '@/services/VacationsService';
  import { mapState } from 'vuex';

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
    name: 'Plan-Vacations',
    components: {
      VueCal,
      AvailabilityApplyVacation,
      // ConfirmLeaveDialog
      ChangesSnackbar
    },
    computed:{
      ...mapState(['session'])
    },
    data() {
      return {
        events: [
          {
            start: '2024-07-25',
            end: '2024-07-25',
            title: 'vacances',
            content: '<i class="icon material-icons">beach_access</i>',
            class: 'leisure'
          },
        ],
        fr,
        changed:false,
        loading:true,
        sending:false,
        snackbar:false,
        snackbarMessage:""
      };
    },
    methods: {
      toggleVacations(date) {
        if(!(date instanceof Date))
        {
          return
        }
        this.changed = true

        // console.log("vacation toggling at : "+date);
        const timelessDate = toTimelessDate(date)
        
        const eventIndex = this.getVacationEventIndex(timelessDate)
        if(eventIndex!=-1)
        {
          this.events.splice(eventIndex,1)
        }
        else
        {
          this.events.push(          
          {
            start: timelessDate,
            end: timelessDate,
            title: 'vacances',
            content: '<i class="icon material-icons">beach_access</i>',
            class: 'leisure'
          },)
        }
      },
      getVacationEventIndex(timelessDate)
      {
        for (let i = 0; i < this.events.length; i++) {
          const event = this.events[i];
          if(event.start==timelessDate)
            return i
        }
        return -1
      },
      async reset()
      {
        this.events = await vacationsService.getVacations(this.session)
        this.changed=false
      },
      async save()
      {
        await vacationsService.setVacations(this.session,this.events)
        this.events = await vacationsService.getVacations(this.session)
        this.changed = false

        this.snackbarMessage = "Changements sauvegardés"
        this.snackbar = true
      },
      async appliedVacations(mode)
      {
        // console.log("vacations applied");
        this.sending = true
        this.events = await vacationsService.getVacations(this.session)
        if(mode=="add")
          this.snackbarMessage = "vacances appliquées"
        else
          this.snackbarMessage = "vacances supprimées"
        this.snackbar = true
        this.sending = false
      },
    //   handleBeforeUnload(event) {
    //     const confirmationMessage = 'Are you sure you want to leave this page?';
    //     event.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    //     return confirmationMessage; // Gecko, WebKit, Chrome <34
    //   }
    },
    // beforeUnmount() {
    //   window.removeEventListener('beforeunload', this.handleBeforeUnload);
    // },
    async mounted()
    {
      this.loading = true
      // console.log("mounted")
      const events = await vacationsService.getVacations(this.session);
      // console.log("events : "+JSON.stringify(events));
      this.events = events

      this.loading = false
      // window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  };

  function toTimelessDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
  </script>