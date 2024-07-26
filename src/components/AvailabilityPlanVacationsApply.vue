<template>
    <v-row>
      <v-spacer></v-spacer>
      <v-card-title>Ajouter ou enlever des vacances</v-card-title>
      <v-spacer></v-spacer>
    </v-row>  
    <v-row>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="disabled" indeterminate :size="30"></v-progress-circular>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="mode" color="secondary" :disabled="disabled">
        <v-btn value="add">Ajouter</v-btn>
        <v-btn value="remove">Enlever</v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
    </v-row>


    <v-form @submit.prevent="submitForm">
      <v-col>
        <v-row>
          <v-col cols="12" md="6">
            <v-date-picker
              class="date-picker"
              title="date de début"
              :locale="$i18n.locale"
              :min="minDate"
              :max="date_fin"
              v-model="date_debut"
              :disabled="disabled"
            ></v-date-picker>
          </v-col>

          <v-col cols="12" md="6">
            <v-date-picker
              class="date-picker"
              title="date de fin"
              :locale="$i18n.locale"
              :min="date_debut"
              v-model="date_fin"
              :disabled="disabled"
            ></v-date-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer/>
          <v-btn color="primary" type="submit"  :disabled="disabled">Appliquer</v-btn>
          <v-spacer/>
        </v-row>
      </v-col>
    </v-form>

  <v-row>
    <v-spacer></v-spacer>
    <v-btn-toggle v-model="mode" class="mt-10 mb-2" color="secondary" :disabled="disabled">
      <v-btn value="add">Ajouter</v-btn>
      <v-btn value="remove">Enlever</v-btn>
    </v-btn-toggle>
    <v-spacer></v-spacer>
  </v-row>
</template>

<style scoped>
  .date-picker {
    width: 100%;
  }
</style>

<script>
import vacationsService from '@/services/VacationsService';
import { mapState } from 'vuex';
export default {
  name: 'WeekPlanningApply',
  props: {
    vacationsChanged:{
      type: Boolean,
      required: false,
      default:false
    },
    disabled:{
      type: Boolean,
      default:false
    }
  },
  watch: {

  },
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateDebut = new Date(today);
    const dateFin = new Date(dateDebut)

    dateFin.setDate(dateDebut.getDate()+14)
    return {
      minDate:today,
      date_debut: dateDebut,
      date_fin: dateFin,
      mode:"add"
    };
  },
  emits: ['vacationsChanged'],
  methods:
  {
    submitForm()
    {
      if (this.vacationsChanged) {
        alert("impossible d'appliquer ces vacances : vous avez des changements non sauvegardés.")
        return
      }
      this.apply()
    },
    async apply()
    {
      // console.log("date debut : "+JSON.stringify(this.date_debut)+", fin : "+JSON.stringify(this.date_fin));
      const dates = rangeDates(this.date_debut,this.date_fin)
      // console.log("date range : "+JSON.stringify(dates));
      if(this.mode=="add")
      {
        // console.log("adding");
        await vacationsService.addVacations(this.session,dates)
      }
      else //if(this.mode=="remove")
      {
        // console.log("removing");
        await vacationsService.removeVacations(this.session,dates)
      }

      this.$emit('vacationsChanged',[this.mode])
    },
  },
  computed:{
    ...mapState(["session"])
  }
};

function rangeDates(start,end)
{
  var workingDate = new Date(start)
  var dates = []
  while(workingDate.getTime()<=end.getTime())
  {
    dates.push(formatDate(workingDate))
    workingDate.setDate(workingDate.getDate()+1)
  }
  return dates
}

function formatDate(dateS)
{
    var date = new Date(dateS)

    const res = `${date.getFullYear()}-${zeroPad((date.getMonth()+1)%12)}-${zeroPad(date.getDate())}`

    // console.log("res : "+res);

    return res
}
function zeroPad(x)
{
    return x.toString().padStart(2,'0')
}

</script>
