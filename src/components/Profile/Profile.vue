<template>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Welcome</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="logout">Logout</v-btn>
            </v-toolbar>
            <v-card-text>
              <p class="text-gray-700 text-base">Hello, {{ username }}!</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    props: {
      username: {
        type: String,
        required: true
      }
    },
    methods: {
      async logout() {
        try {
          await axios.post('/auth/logout');
          localStorage.removeItem('username');
          this.$emit('logout-success');
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
    }
  };
  </script>