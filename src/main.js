import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store/index.js'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import axiosInstance from './plugins/axios'

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.use(store);

app.config.globalProperties.$axios = axiosInstance

app.mount('#app');