import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import BookRdv from '../views/BookApointment.vue';
import Login from '../views/Login.vue';
import Availability from '../views/Availability.vue'
import Whitelist from '../views/Whitelist.vue'
import ConsultationTypesGet from '@/views/ConsultationTypes/ConsultationTypesGet.vue';
import ConsultationTypesUpdate from '@/views/ConsultationTypes/ConsultationTypesUpdate.vue';
import Consultations from '@/views/Consultations.vue';

import Test from '../views/Test.vue'

import NotFound from '../views/NotFound.vue';

const routes = [

  //partie patient

  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/BookApointment',
    name: 'BookApointment',
    component: BookRdv
  },

  // partie prestataire

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // {
  //   path: '/change-password',
  //   name: 'WeekPlanning',
  //   component: WeekPlanning
  // },
  {
    path: '/availability',
    name: 'UpdateAvailability',
    component: Availability
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: Whitelist
  },
  {
    path: '/consultationTypes',
    name: 'ConsultationTypes',
    component: ConsultationTypesGet
  },
  {
    path: '/consultationTypes/update/:id',
    name: 'ConsultationTypesUpdate',
    component: ConsultationTypesUpdate
  },
  {
    path: '/consultations',
    name: 'Consultations',
    component: Consultations
  },

  {
    path: '/test',
    name: 'Test',
    component: Test
  },

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