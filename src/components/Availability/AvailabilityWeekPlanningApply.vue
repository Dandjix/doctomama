<template>
  <v-card class="my-5 pb-5">



    <v-card-title>Appliquer le patron</v-card-title>
    <v-form @submit.prevent="submitForm">
      <v-col>
        <v-row>
          <v-col cols="12" md="6">
            <v-date-picker
              class="date-picker"
              title="date de début"

              :min="minDate"
              :max="date_fin"
              v-model="date_debut"

            ></v-date-picker>
          </v-col>

          <v-col cols="12" md="6">
            <v-date-picker
              class="date-picker"
              title="date de fin"

              :min="date_debut"
              :max="maxDate"
              v-model="date_fin"
            ></v-date-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer/>
          <v-btn color="primary" type="submit">Appliquer</v-btn>
          <v-spacer/>
        </v-row>
      </v-col>
    </v-form>
  </v-card>



  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-title>Changements non enregistrés</v-card-title>
      <v-card-text>
        Vous avez des changements non enregistrés dans votre planning hebdomadaire. 
        Voulez vous appliquer ces changements, ou les annuler ?
      </v-card-text>
      <v-row>
        <v-spacer/>
        <v-btn color="error" @click="deleteUnsavedChanges">Supprimer les changements et appliquer le planning</v-btn>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-btn color="primary" @click="applyUnsavedChanges">Appliquer les changements et appliquer le planning</v-btn>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-btn color="yellow-darken-4" @click="dialogVisible=false">Revenir en arrière</v-btn>
        <v-spacer/>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .date-picker {
    width: 100%;
  }
</style>

<script>
import WeekPlanningService from '@/services/WeekPlanningService';
import { mapState } from 'vuex';
export default {
  name: 'WeekPlanningApply',
  props: {
    minDate: {
      type: Date,
      default: () => {
        var date = new Date()
        date.setHours(0,0,0,0)
        return date
      }
    },
    maxDate: {
      type: Date,
      default: () => {
        var date = new Date()
        date.setHours(0,0,0,0)
        return date
      }
    },
    planningChanged: {
      type: Boolean,
      ddefault: false
    }
  },
  watch: {
    maxDate(value) {
      this.date_fin = value;
      this.date_fin.setHours(0,0,0,0)
    }
  },
  data() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return {
      date_debut: date,
      date_fin: this.maxDate,
      dialogVisible: false
    };
  },
  emits: ['revertChanges', 'applyChanges'],
  methods:
  {
    submitForm()
    {
      // console.log("about to apply");
      if(this.planningChanged)
      {
        this.dialogVisible=true
        return
      }
      this.applyPatern()
    },
    async applyPatern()
    {
      // this.date_debut
      // this.date_fin
      // console.log("applying ...");
      // console.log(`debut : ${JSON.stringify(this.date_debut)}, fin : ${JSON.stringify(this.date_fin)}`);
      await WeekPlanningService.applyPatern(this.session,this.date_debut,this.date_fin)
      // console.log("applied !");
    },
    deleteUnsavedChanges()
    {
      this.$emit("revertChanges")
      this.dialogVisible=false
    },
    applyUnsavedChanges()
    {
      this.$emit("applyChanges")
      this.dialogVisible=false
    }
  },
  computed:{
    ...mapState(["session"])
  }
};
</script>
