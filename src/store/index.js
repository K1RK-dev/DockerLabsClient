import { createStore } from 'vuex';
import app from './modules/app.js';
import auth from './modules/auth.js';
import labs from './modules/labs.js';

const store = createStore({
  modules: {
    app,
    auth,
    labs,
  }
});

export default store;