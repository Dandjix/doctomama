<template>
  <div>
    <h1>Prendre rendez-vous</h1>
    <v-col>
      <v-row cols="6" class="mb-5">
        <ConsultationsTypeSelect v-model="consultationType"></ConsultationsTypeSelect>
      </v-row>
      <v-divider></v-divider>

      <TimeSlotsList :timeSlots="timeSlots" 
      :duration="duration" 
      @book="showBookPopup"
      class="mt-5"></TimeSlotsList>
    </v-col>

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
      snackbarMessage:""
    }
  },
  watch:{
    async consultationType()
    {
      this.refreshTimeSlots()
    }
  },
  methods:{
    async showBookPopup(start)
    {
      // console.log("ct : "+JSON.stringify(this.consultationType));
      // console.log("booking : "+start+", "+this.consultationType.value);
      this.dialogStart = new Date(start)
      this.dialogVisible = true
    },
    async book(email,phoneNbr)
    {
      console.log("booking : "+email+", "+phoneNbr);
      
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
    },
    async refreshTimeSlots()
    {
      if(!this.consultationType || !(this.consultationType instanceof Object))
      {
        this.timeSlots = []
        this.duration = -1
        return
      }
      // console.log("id : "+JSON.stringify(this.consultationType));
      this.duration = this.consultationType.duration
      this.timeSlots = await consultationsService.getTimeSlots(this.consultationType.value)
      // console.log("time slots : "+JSON.stringify(this.timeSlots));
      
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