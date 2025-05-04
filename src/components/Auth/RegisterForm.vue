<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="username" label="Username" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import authService from '../../services/authService';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        await authService.register(this.username, this.password);
        this.$router.push('/login'); // Перенаправляем на страницу логина
      } catch (error) {
        console.error('Registration failed', error);
        // TODO: Отобразить сообщение об ошибке пользователю
      }
    }
  }
};
</script>