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
        v-model="localTimeStep"
        color="primary"
        mandatory
    >
        <v-btn :value="60">1 heure</v-btn>
        <v-btn :value="30">30 minutes</v-btn>
        <v-btn :value="15">15 minutes</v-btn>
        <v-btn :value="5">5 minutes</v-btn>
        <v-btn :value="1">1 minute</v-btn>
    </v-btn-toggle>
    <v-spacer/>
    </v-row>
    </v-col>

</template>

<script>

export default {
  name: 'TimeStepSelector',
  props:{
    modelValue: {
        type:Number,
        default: 1
    }
  },
  data() {
    return {
      time_step:1
    };
  },
  methods: {

  },
  computed: {
    localTimeStep: {
        get(){
            
            return this.modelValue
        },
        set(value){
            this.$emit('update:modelValue', value);
        }
    }
  }
};
</script>