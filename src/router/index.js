import { createRouter, createWebHistory } from 'vue-router';
import Profile from '../components/Profile/Profile.vue';
import LoginForm from '../components/Auth/LoginForm.vue';
import RegisterForm from '../components/Auth/RegisterForm.vue';
import store from '../store/index.js'

const routes = [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (store.getters['auth/user'] === null) {
    try {
      await store.dispatch('auth/fetchUser');
    } catch (error) {
      console.error("Failed to fetch user:", error);
      next('/login');
      return;
    }
  }
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  if (to.path === '/') {
    if (isLoggedIn) {
      next('/profile');
    } else {
      next('/login');
    }
  } 
  else if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } 
  else {
    next();
  }
});

export default router;