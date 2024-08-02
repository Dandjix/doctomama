<template>
  <div>
    <h1>Prendre rendez-vous</h1>
    <v-col>
      <v-row cols="6" class="mb-5">
        <ConsultationsTypeSelect v-model="consultationType"></ConsultationsTypeSelect>
      </v-row>
      <v-divider></v-divider>

      <TimeSlotsList :timeSlots="timeSlots" :duration="duration" class="mt-5"></TimeSlotsList>
    </v-col>

  </div>
</template>

<script>
import TimeSlotsList from '@/components/BookConsultation/TimeSlotsList.vue';
import ConsultationsTypeSelect from '@/components/Consultations/ConsultationsTypeSelect.vue';

import consultationsService from '@/services/ConsultationsService';

export default {
  name: 'Prendre Rendez-Vous',
  components: {
    TimeSlotsList,
    ConsultationsTypeSelect
  },
  data(){
    return{
      timeSlots:[],
      consultationType:null,
      duration:60
    }
  },
  watch:{
    async consultationType(newValue)
    {
      if(!newValue || !(newValue instanceof Object))
      {
        this.timeSlots = []
        this.duration = -1
        return
      }
      // console.log("id : "+JSON.stringify(newValue));
      this.duration = newValue.duration
      this.timeSlots = await consultationsService.getTimeSlots(newValue.value)


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