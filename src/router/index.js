import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import BookRdv from '../views/BookRdv.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;