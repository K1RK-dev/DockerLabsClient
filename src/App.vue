<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import store from './store';
export default {
  created() {
    store.dispatch('auth/fetchUser');
  }
};
</script>