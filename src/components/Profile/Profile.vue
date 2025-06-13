<template>
  <v-app style="height: 100vh;">
    <v-app-bar app color="#2196F3" dark flat clipped-left>
      <v-toolbar :elevation="0" class="minimal-toolbar">
        <div class="logo">DockerLabs</div>
        <div class="vertical-line"></div>

        <v-btn
          text
          @click="activeModule = 'labs'"
          :class="{ 'module-active': activeModule === 'labs' }"
          class="module-button"
        >
          Labs
        </v-btn>

        <v-btn
          text
          @click="activeModule = 'students'"
          :class="{ 'module-active': activeModule === 'students' }"
          class="module-button"
        >
          Students
        </v-btn>

        <v-btn
          text
          @click="activeModule = 'images'"
          :class="{ 'module-active': activeModule === 'images' }"
          class="module-button"
        >
          Images
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          text
          @click="activeModule = 'settings'"
          :class="{ 'module-active': activeModule === 'settings' }"
          class="module-button"
        >
          Settings
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="user-button">
              <v-icon left>mdi-account-circle</v-icon>
              {{ username }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn text class="logout-button" @click="logout">
                <v-icon left>mdi-logout</v-icon>
                Logout
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-app-bar>

    <v-main class="docker-main fill-height">
      <v-container fluid>
        <v-card class="module-card">
          <v-card-text>
            <Labs v-if="activeModule === 'labs'" />
            <Settings v-if="activeModule === 'settings'" />
            <Students v-if="activeModule === 'students'" />
            <Images v-if="activeModule === 'images'" />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

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
    const username = localStorage.getItem('username');
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
.minimal-toolbar {
  padding: 0 16px;
  background-color: rgba(20, 20, 212, 0.404);
  display: flex;
  align-items: center;
}

.logo {
  font-family: 'Arial', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #BBDEFB;
  margin-right: 20px;
}

.vertical-line {
  height: 30px;
  border-left: 1px solid #BBDEFB;
  margin-right: 20px;
}

.module-button {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;
}

.module-active {
  font-weight: bold !important;
  text-decoration: none;
  color: #BBDEFB !important;
  border-bottom: 2px solid #BBDEFB;
}

.user-button {
  color: rgba(255, 255, 255, 0.7) !important;
  margin-left: 16px;
  transition: background-color 0.3s ease;
}

.user-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-button {
  color: #333 !important;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: rgba(243, 5, 5, 0.555) !important;
}

.docker-main {
  background-color: transparent;
}

/* Стиль для карточки модуля */
.module-card {
  max-width: 100%; /* Занимает большую часть экрана */
  margin: 20px auto; /* Центрирование по горизонтали и небольшой отступ сверху */
  border-radius: 10px; /* Скругленные углы */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Небольшая тень */
}

/* Стиль для текста внутри карточки */
.module-card-text {
  padding: 20px; /* Отступы внутри карточки */
}
</style>