import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import Login from '../views/Login.vue';
import Availability from '../views/Availability.vue'
import Whitelist from '../views/Whitelist.vue'
import ConsultationTypesGet from '@/views/ConsultationTypes/ConsultationTypesGet.vue';
import ConsultationTypesUpdate from '@/views/ConsultationTypes/ConsultationTypesUpdate.vue';

import ConsultationsProvider from '@/views/Consultations/ConsultationsProvider.vue';
import ConsultationBook from '../views/Consultations/ConsultationBook.vue';
import ConsultationsPatient from '@/views/Consultations/ConsultationsPatient.vue';
import ConsultationsPatientEnterEmail from '@/views/Consultations/ConsultationsPatientEnterEmail.vue';

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
    path: '/BookConsultation',
    name: 'BookConsultation',
    component: ConsultationBook
  },
  {
    path: '/ConsultationsPatientEmail',
    name: 'ConsultationsPatientEmail',
    component: ConsultationsPatientEnterEmail
  },
  {
    path: '/ConsultationsPatient',
    name: 'ConsultationsPatient',
    component: ConsultationsPatient
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
    path: '/consultationsProvider',
    name: 'ConsultationsProvider',
    component: ConsultationsProvider
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