<template>
  <v-card>



    <v-card-title>Appliquer le patron</v-card-title>
    <v-form @submit.prevent="submitForm">
      <v-col>
        <v-row>
          <v-col cols="6">
            <v-date-picker
              class="date-picker"
              title="date de début"

              :locale="$i18n.locale"
              :min="minDate"
              :max="date_fin"
              v-model="date_debut"

            ></v-date-picker>
          </v-col>

          <v-col cols="6">
            <v-date-picker
              class="date-picker"
              title="date de fin"
              :locale="$i18n.locale"
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
        <v-btn color="red" @click="deleteUnsavedChanges">Supprimer les changements et appliquer le planning</v-btn>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-btn color="primary" @click="applyUnsavedChanges">Appliquer les changements et appliquer le planning</v-btn>
        <v-spacer/>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-btn color="yellow" @click="dialogVisible=false">Revenir en arrière</v-btn>
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
      default: () => new Date()
    },
    maxDate: {
      type: Date,
      default: () => new Date()
    },
    planningChanged: {
      type: Boolean,
      ddefault: false
    }
  },
  watch: {
    maxDate(value) {
      this.date_fin = value;
    }
  },
  data() {
    return {
      date_debut: new Date(),
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
      console.log("applying ...");
      await WeekPlanningService.applyPatern(this.session,this.date_debut,this.date_fin)
      console.log("applied !");
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
