<template>
    <v-container>
        <v-card class="container">
            <h1>Paramètres</h1>
            <v-form @submit.prevent="validateAndSubmit" v-model="formValid" ref="form">
                <v-row>
                    <v-col>
                        <v-time-picker
                            :disabled="loading"
                            title="heure de début du calendrier"
                            v-model="heure_debut"
                            format="24hr"
                            @update:hour="changeStartHour"
                            full-width
                        ></v-time-picker>
                    </v-col>
                    <v-col>
                        <v-time-picker
                            :disabled="loading"
                            title="heure de fin du calendrier"
                            v-model="heure_fin"
                            @update:hour="changeEndHour"
                            :min="heure_debut"
                            format="24hr"
                        ></v-time-picker>
                    </v-col>
                </v-row>
                <v-row>
                    <v-spacer/>
                        <v-text-field label="Durée de la planification (jours)" 
                        type="number" :min="1" :max="730" v-model="duree_planification"
                        :rules="rules_duree_planification"
                        >
                        </v-text-field>
                    <v-spacer/>
                </v-row>
                <v-row style="padding: 30px;">
                    <v-spacer/>
                    <v-progress-circular v-if="sending" class="spinner" indeterminate :size="30"></v-progress-circular>
                    <v-spacer/>
                </v-row>
                <v-row>
                    <v-spacer/>
                    <v-btn color="primary" :disabled="sending||loading||!formValid" class="send-btn" type="submit" block>Sauvegarder</v-btn>
                    <v-spacer/>
                </v-row>
            </v-form>
        </v-card>
    </v-container>
  </template>
  
  <script>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import '../../services/SettingsService'
  import SettingsService from '../../services/SettingsService';
  import { mapState } from 'vuex';
  export default {
    name: 'OptionsDisponibilités',
  
    data: () => ({
        heure_debut:"00:00",
        heure_fin:"00:00",
        duree_planification:60,
        sending:false,
        loading:true,
        formValid:true,
        rules_duree_planification: [
            value => {
                if(value<1)
                    return "La valeur minimum est de 1 jour"
                if(value>730)
                    return "La valeur maximum est de 2 ans"
                return true
            },
      ],
    }),
    components : {
        VTimePicker
    },
    watch: {
        heure_debut(newTime) {
        this.changeStartTime(newTime);
        }
    },
    methods : {
        changeStartTime(startTime) {
            // console.log("changed start date to : "+ startTime+" ("+this.heure_debut+"), heure_fin : "+this.heure_fin);
            if(isBefore(this.heure_fin,startTime)){
                // console.log("changed to "+date);
                this.heure_fin = startTime
            }
        },
        changeStartHour(hour){
            // console.log("changed start hour to : " + hour+", heure : "+this.heure_debut);
            const minutes = this.heure_debut.split(":")[1];
            this.heure_debut=`${hour}:${minutes}`
        },
        changeEndHour(hour){
            // console.log("changed start hour to : " + hour+", heure : "+this.heure_debut);
            const minutes = this.heure_fin.split(":")[1];
            this.heure_fin=`${hour}:${minutes}`
        },
        async validateAndSubmit(){
            if(this.formValid)
            {
                // console.log("looks clear !");
                await this.saveSettings()
                return
            }
            // console.log("not clear !");
        },
        async saveSettings(){
            // console.log("setting settings");
            this.sending=true
            await SettingsService.setSetting("heure_debut_calendrier",this.heure_debut,this.session)
            await SettingsService.setSetting("heure_fin_calendrier",this.heure_fin,this.session)
            await SettingsService.setSetting("duree_planification",this.duree_planification,this.session)
            // await delay(1000);
            this.sending=false
            // await SettingsService.setSetting("heure_fin_calendrier")
            // alert("options enregistrées")
        },
        async loadSettings(){
            // await delay(1000)
            this.heure_debut = await SettingsService.getSetting("heure_debut_calendrier")
            this.heure_fin = await SettingsService.getSetting("heure_fin_calendrier")
            this.duree_planification = await SettingsService.getSetting("duree_planification")
            this.loading = false
        }
    }
    ,async mounted()
    {
        // console.log("inside mounted");
        await this.loadSettings()
    },
    computed : {
        ...mapState(['session'])
    }
  }


  function isBefore(before,after)
  {
    let [h1,min1] = before.split(":")
    let [h2,min2] = after.split(":")

    h1 = parseInt(h1, 10)
    min1 = parseInt(min1, 10)
    h2 = parseInt(h2, 10)
    min2 = parseInt(min2, 10)

    // console.log("h1 : "+h1+", min1 : "+min1+", h2 : "+h2+", min2 : "+min2);

    // console.log("h1<h2 : "+(h1<h2)+", h1>h2 : "+(h1>h2)+", min1 < min2 : "+(min1 < min2));
    // console.log();

    if(h1<h2){
        return true
    }

    if(h1>h2){
        return false
    }
    
    return min1 < min2
  }

    // function delay(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
  </script>

<style>
    .container{
        padding: 30px;
    }
</style>
  