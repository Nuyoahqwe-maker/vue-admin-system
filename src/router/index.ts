import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==================== 1. 登录页（顶层路由，独立于 Layout） ====================
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' },
    },

    // ==================== 2. 后台主布局（包含所有子页面） ====================
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: '首页' },
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '用户管理' },
        },
      ],
    },
  ],
})

// ==================== 3. 全局路由守卫（权限控制） ====================
router.beforeEach((to, from, next) => {
  // 从 localStorage 里拿 token
  const token = localStorage.getItem('token')

  // 如果要去的是登录页，直接放行
  if (to.path === '/login') {
    next()
    return
  }

  // 如果没登录（没有 token），强制跳转到登录页
  if (!token) {
    next('/login')
  } else {
    // 已登录，正常放行
    next()
  }
})

export default router
