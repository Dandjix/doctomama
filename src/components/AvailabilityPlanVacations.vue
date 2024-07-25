<template>
    <h1>planifier mes vancances</h1>
    <div>
      <vue-cal
        style="height: 600px"
        :events="events"
        class="vacation-calendar"
        :locale="fr"
        @cell-click="toggleVacations"

        :time="false" active-view="week" :disable-views="['day']"
      />
    </div>
    <AvailabilityApplyVacation/>
  </template>
  
  <style scoped>
  >>>.vuecal__event.leisure {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}

  >>>.vuecal__cell-events-count {    background: #fd9c42;}

</style>


<script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import AvailabilityApplyVacation from './AvailabilityApplyVacation.vue';
  
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
      AvailabilityApplyVacation
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
        fr
      };
    },
    methods: {
      toggleVacations(date) {
        console.log("vacation toggling at : "+date);
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
      }
    }
  };

  function toTimelessDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
  </script>