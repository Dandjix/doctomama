import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import BookRdv from '../views/BookRdv.vue';
import Login from '../views/Login.vue';
import Availability from '../views/Availability.vue'

import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/book-rdv',
    name: 'BookRdv',
    component: BookRdv
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/availability',
    name: 'UpdateAvailability',
    component: Availability
  },
  // {
  //   path: '/change-password',
  //   name: 'WeekPlanning',
  //   component: WeekPlanning
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;