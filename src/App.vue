<template>
  <v-app>
    <v-main>
      <RegisterForm v-if="showRegisterForm" @register-success="goToLogin" />
      <LoginForm
        v-if="!isLoggedIn && !showRegisterForm"
        @login-success="handleLoginSuccess"
        @go-to-register="goToRegister"
      />
      <Profile v-else-if="isLoggedIn" :username="username" @logout-success="handleLogoutSuccess" />
    </v-main>
  </v-app>
</template>

<script>
import LoginForm from './components/Auth/LoginForm.vue';
import Profile from './components/Profile/Profile.vue'
import RegisterForm from './components/Auth/RegisterForm.vue';

export default {
  components: {
    LoginForm,
    Profile,
    RegisterForm
  },
  data() {
    return {
      isLoggedIn: localStorage.getItem('username') !== null,
      username: localStorage.getItem('username') || '',
      showRegisterForm: false
    };
  },
  methods: {
    handleLoginSuccess(username) {
      this.isLoggedIn = true;
      this.username = username;
    },
    handleLogoutSuccess() {
      this.isLoggedIn = false;
      this.username = '';
    },
    goToRegister() {
      this.showRegisterForm = true;
    },
    goToLogin() {
      this.showRegisterForm = false;
    }
  }
};
</script>