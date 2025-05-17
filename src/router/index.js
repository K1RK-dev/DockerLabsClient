import { createRouter, createWebHistory } from 'vue-router';
import Profile from '../components/Profile/Profile.vue';
import LoginForm from '../components/Auth/LoginForm.vue';
import RegisterForm from '../components/Auth/RegisterForm.vue';

const routes = [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
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

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !localStorage.getItem('username')) {
      next('/login');
    } else {
      next();
    }
  });

export default router;