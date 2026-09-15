import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: '首页' }, // 这里添加 meta
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/user/index.vue'), // 注意：这里先写好，稍后建文件
          meta: { title: '用户管理' },
        },
      ],
    },
  ],
})

export default router
