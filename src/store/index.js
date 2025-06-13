import { createStore } from 'vuex';
import app from './modules/app.js';
import auth from './modules/auth.js';
import labs from './modules/labs.js';
import groups from './modules/groups.js';
import docker from './modules/docker.js';
import users from './modules/users.js';
import containers from './modules/containers.js';

const store = createStore({
  modules: {
    app,
    auth,
    containers,
    labs,
    groups,
    users,
    docker
  }
});

export default store;