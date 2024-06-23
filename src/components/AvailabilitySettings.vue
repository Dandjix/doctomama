<template>
    <v-container>
        <v-card class="container">
            <v-row>
                <v-col>
                    <v-time-picker
                        title="heure de début du calendrier"
                        v-model="heure_debut"
                        format="24hr"
                        @update:hour="changeStartHour"
                        full-width
                    ></v-time-picker>
                </v-col>
                <v-col>
                    <v-time-picker
                        title="heure de fin du calendrier"
                        v-model="heure_fin"
                        :min="heure_debut"
                        format="24hr"
                    ></v-time-picker>
                </v-col>
            </v-row>
            <!-- <v-row>
                <v-col>
                    <v-label for="">

                    </v-label>
                    <v-color-picker
                        id="couleur_rendez-vous"
                        class="ma-2"
                        swatches-max-height="400px"
                        hide-inputs
                        show-swatches
                    ></v-color-picker>
                </v-col>
            </v-row> -->
        </v-card>
    </v-container>
  </template>
  
  <script>
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  export default {
    name: 'HelloWorld',
  
    data: () => ({
        heure_debut:"00:00",
        heure_fin:"00:00"
    }),
    components : {
        VTimePicker
    },
    watch: {
        heure_debut(newTime) {
        this.changeStartDate(newTime);
        }
    },
    methods : {
        changeStartDate(date) {
            // console.log("changed start date to : " + date+", heure_fin : "+this.heure_fin);
            if(isBefore(this.heure_fin,date)){
                // console.log("changed to "+date);
                this.heure_fin = date
            }
        },
        changeStartHour(hour){
            // console.log("changed start hour to : " + hour+", heure : "+this.heure_debut);
            const minutes = this.heure_debut.split(":")[1];
            this.heure_debut=`${hour}:${minutes}`
        }
    }
  }

  function isBefore(before,after)
  {
    const [h1,min1] = before.split(":")
    const [h2,min2] = after.split(":")

    // console.log("h1 : "+h1+", h2 : "+h2+", min1 : "+min1+", min2 : "+min2);

    if(h1<h2)
        return true
    if(h2>h1)
        return false
    return min1 < min2
  }
  </script>

<style>
    .container{
        padding: 30px;
    }
</style>
  