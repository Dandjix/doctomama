<template>
    <v-card>
      <v-card-title>Appliquer le patron</v-card-title>
      <v-col>
        <v-row>
          <v-col cols="6">
            <v-date-picker
              class="date-picker"
              :locale="$i18n.locale"
              :min="minDate"
              :max="maxDate"
            ></v-date-picker>
          </v-col>
  
          <v-col cols="6">
            <v-date-picker
              class="date-picker"
              :locale="$i18n.locale"
              :min="minDate"
              :max="maxDate"
            ></v-date-picker>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </template>
  
  <style scoped>
    .date-picker {
      width: 100%;
    }
  </style>
  
  <script>
  export default {
    name: 'WeekPlanningApply',
    props: {
      minDate: {
        type: Date,
        default: new Date()
      },
      maxDate: {
        type: Date,
        default: new Date()
      }
    }
  }
  </script>