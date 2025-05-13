<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="username" label="Username" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login" :loading="isLoading">
              Submit
            </v-btn>
            <v-btn color="primary" @click="goToRegister">
              Register
            </v-btn>
          </v-card-actions>
          <v-alert v-if="error" type="error" dismissible>
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginForm',
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');

    const isLoading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/error']);

    const login = async () => {
      try {
        await store.dispatch('auth/login', {
          username: username.value,
          password: password.value,
        });
        if (store.getters['auth/isLoggedIn']) {
          router.push('/profile');
        } else {
          console.warn('Login failed');
        }
      } catch (err) {
        console.error('Login failed', err);
      }
    };

    const goToRegister = () => {
      router.push('/register');
    };

    return {
      username,
      password,
      isLoading,
      error,
      login,
      goToRegister
    };
  },
};
</script>