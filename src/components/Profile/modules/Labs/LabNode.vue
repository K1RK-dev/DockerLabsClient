<template>
    <v-card class="lab-node">
      <v-card-title>{{ lab.title }}</v-card-title>
      <v-card-subtitle>{{ lab.description }}</v-card-subtitle>
      <v-card-actions>
        <v-btn color="primary" @click="openLab">Open Lab</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      lab: {
        type: Object,
        required: true
      }
    },
    emits: ['open-lab'],
    methods: {
      openLab() {
        this.$emit('open-lab', this.lab.id);
      }
    }
  };
  </script>
  
  <style scoped>
  .lab-node {
    margin-bottom: 16px;
  }
  </style>