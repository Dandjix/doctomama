<template>
    <v-dialog v-model="isVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirm">Oui</v-btn>
          <v-btn color="green darken-1" text @click="cancel">Non</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'ConfirmDialog',
    props: {
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isVisible: this.value,
      };
    },
    watch: {
      value(val) {
        this.isVisible = val;
      },
      isVisible(val) {
        this.$emit('input', val);
      },
    },
    methods: {
      confirm() {
        this.$emit('confirm');
        this.isVisible = false;
      },
      cancel() {
        this.$emit('cancel');
        this.isVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any styles you need for your dialog */
  </style>