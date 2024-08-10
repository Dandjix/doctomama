<template>
  <div>
    <!-- <h1>Prendre rendez-vous</h1> -->
    <v-col>

      <v-row>
        <v-spacer></v-spacer>
        <v-sheet  class="my-5" width="500">
          <ConsultationsTypeSelect v-model="consultationType" clearable></ConsultationsTypeSelect>
        </v-sheet>
        <v-spacer></v-spacer>
      </v-row>




      <v-divider></v-divider>

      <v-pagination v-model="page" :length="nbPages"></v-pagination>

      <TimeSlotsList 
        :timeSlots="timeSlots" 
        :duration="duration" 
        :start="startDate"
        :end="endDate"

        :disabled="timeSlotsListDisabled"
        @book="showBookPopup"
        class=""></TimeSlotsList>
      </v-col>

      <v-pagination v-model="page" :length="nbPages"></v-pagination>

    <BookConsultationDialog 
    v-model="dialogVisible" 
    :start="dialogStart" 
    :consultationType="consultationType"
    :disabled="dialogDisabled"
    @confirmed="book">
  </BookConsultationDialog>

  <ChangesSnackbar v-model="snackbar" :message="snackbarMessage"></ChangesSnackbar>
  </div>
</template>

<script>
import TimeSlotsList from '@/components/BookConsultation/TimeSlotsList.vue';
import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';
import BookConsultationDialog from '@/components/BookConsultation/BookConsultationDialog.vue'
import ChangesSnackbar from '@/components/Utility/ChangesSnackbar.vue';

import consultationsService from '@/services/ConsultationsService';
import { mapActions, mapGetters } from 'vuex';
import timeSlotsService from '@/services/TimeSlotsService';
import SettingsService from '@/services/SettingsService';

export default {
  name: 'Prendre Rendez-Vous',
  components: {
    TimeSlotsList,
    ConsultationsTypeSelect,
    BookConsultationDialog,
    ChangesSnackbar
  },
  data(){
    return{
      timeSlots:[],
      consultationType:null,
      duration:60,

      dialogVisible:false,
      dialogDisabled:false,
      dialogStart:null,

      snackbar:false,
      snackbarMessage:"",

      timeSlotsListDisabled:false,
      nbDaysPlanification:-1,

      page:1,
      nbPages:0,
      startDate:null,
      endDate:null
    }
  },
  watch:{
    async consultationType(newValue)
    {
      // console.log("new Value : "+newValue);
      
      if(newValue==null)
      {
        this.startDate = null
        this.endDate = null
        this.nbPages = 0
        this.page = 1
      }
      await this.refreshTimeSlots()
    },
    async page()
    {
      this.timeSlotsListDisabled = true
      await this.pageChanged()
      this.timeSlotsListDisabled = false
    }
  },
  computed:{
    ...mapGetters(['email_patient','telephone_patient'])
  },
  methods:{
    ...mapActions(['setPatientEmail','setPatientTelephone']),
    async showBookPopup(start)
    {
      // console.log("ct : "+JSON.stringify(this.consultationType));
      // console.log("booking : "+start+", "+this.consultationType.value);
      this.dialogStart = new Date(start)
      this.dialogVisible = true
    },
    async book(email,phoneNbr)
    {
      // console.log("booking : "+email+", "+phoneNbr);
      
      this.dialogDisabled = true

      const start = this.dialogStart
      const consultationType = this.consultationType.value


      // console.log("start : "+start+", ct : "+consultationType);
      await consultationsService.createConsultation(email,phoneNbr,consultationType,start)
      await this.refreshTimeSlots()
      this.dialogDisabled = false
      this.dialogVisible = false

      this.snackbarMessage = "Consultation réservée avec succès"
      this.snackbar = true

      this.setPatientEmail(email)
      this.setPatientTelephone(phoneNbr)
    },
    async refreshTimeSlots()
    {
      // console.log("consT : "+this.consultationType);
      
      if(!this.consultationType || !(this.consultationType instanceof Object))
      {
        // console.log("null or not object");
        
        this.timeSlots = []
        this.duration = -1
        return
      }
      // console.log("id : "+JSON.stringify(this.consultationType));

      this.timeSlotsListDisabled = true

      this.nbDaysPlanification = await SettingsService.getSetting("duree_planification")
      this.nbPages = Math.ceil(this.nbDaysPlanification/7)
      //ceil did not really work so whatever i dont like to think 
      this.page = 1

      await this.pageChanged()

      this.timeSlotsListDisabled = false
      // this.duration = this.consultationType.duration
      // this.timeSlots = await timeSlotsService.getTimeSlotsInRange(this.consultationType.value,this.startDate,this.endDate)
      // console.log("time slots : "+JSON.stringify(this.timeSlots));
      
    },
    async pageChanged()
    {
      if(!this.consultationType || !(this.consultationType instanceof Object))
      {
        // console.log("null or not object");
        
        this.timeSlots = []
        this.duration = -1
        return
      }

      const daysPerPage = 7

      var startDate = new Date()
      startDate.setHours(0,0,0,0)

      const nbDaysDebut = startDate.getTime()/(24*60*60*1000)
      const maxDays = nbDaysDebut + this.nbDaysPlanification

      startDate.setDate(startDate.getDate()+daysPerPage*(this.page-1))
      const endDate = new Date(startDate)




      endDate.setDate(startDate.getDate()+(daysPerPage-1))

      if(endDate.getTime()/(24*60*60*1000)>maxDays)
      endDate.setTime(maxDays*(24*60*60*1000))

      this.startDate = startDate

      this.endDate = endDate

      // console.log("range : "+JSON.stringify(startDate)+", ed : "+JSON.stringify(endDate));


      this.duration = this.consultationType.duration
      this.timeSlots = await timeSlotsService.getTimeSlotsInRange(this.consultationType.value,this.startDate,this.endDate)
    }
  },
  async mounted(){
    // this.timeSlots = consultationsService.getTimeSlots(this.consultationType.id)
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>