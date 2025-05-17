<template>
  <v-app>
    <v-app-bar app color="primary" dark flat>
      <v-toolbar :elevation="8">
        <v-btn
          text
          @click="activeModule = 'labs'"
          :class="{ 'module-active': activeModule === 'labs' }"
        >
          Labs
        </v-btn>
        <v-btn
          text
          @click="activeModule = 'students'"
          :class="{ 'module-active': activeModule === 'students' }"
        >
          Students
        </v-btn>
        <v-btn
          text
          @click="activeModule = 'settings'"
          :class="{ 'module-active': activeModule === 'settings' }"
        >
          Settings
        </v-btn>
        <v-btn
          text
          @click="activeModule = 'images'"
          :class="{ 'module-active': activeModule === 'images' }"
        >
          Images
        </v-btn>
        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">{{ username }}</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn text @click="logout">Logout</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row>
          <v-col cols="12">
            <Labs v-if="activeModule === 'labs'" />
            <Settings v-if="activeModule === 'settings'" />
            <Students v-if="activeModule === 'students'" />
            <Images v-if="activeModule === 'images'" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

import Labs from './modules/Labs/LabsModule.vue';
import Settings from './modules/Settings/SettingsModule.vue';
import Students from './modules/Students/StudentsModule.vue';
import Images from './modules/Images/ImagesModule.vue';

export default {
  name: 'Profile',
  components: {
    Labs,
    Settings,
    Students,
    Images,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = computed(() => store.getters['auth/user'] ? store.getters['auth/user'].username : '');
    const activeModule = ref('labs');

    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };

    return {
      username,
      logout,
      activeModule,
    };
  },
};
</script>

<style scoped>
.module-active {
  font-weight: bold !important;
  text-decoration: underline;
}

.v-main .v-container {
  padding: 20px;
}
</style>