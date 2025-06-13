import { createStore } from 'vuex';
import app from './modules/app.js';
import auth from './modules/auth.js';
import labs from './modules/labs.js';
import groups from './modules/groups.js';
import docker from './modules/docker.js';
import users from './modules/users.js';

const store = createStore({
  modules: {
    app,
    auth,
    labs,
    groups,
    users,
    docker
  }
});

export default store;