import {createRouter, createWebHistory} from 'vue-router';
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/client',
      component: () => import('@/views/Client.vue'),
    },
    {
      path: '/server',
      component: () => import('@/views/Server.vue'),
    },
  ],
});