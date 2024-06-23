<template>
    <v-col>
    <v-row>
    <v-spacer/>
    <p>Intervale de placement</p>
    <v-spacer/>
    </v-row>
    <v-row>
    <v-spacer/>
    <v-btn-toggle
        v-model="time_step"
        color="primary"
        mandatory
    >
        <v-btn value=60>1 heure</v-btn>
        <v-btn value=30>30 minutes</v-btn>
        <v-btn value=15>15 minutes</v-btn>
        <v-btn value=5>5 minutes</v-btn>
    </v-btn-toggle>
    <v-spacer/>
    </v-row>
    </v-col>

</template>