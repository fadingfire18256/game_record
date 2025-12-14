import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/MainPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('@/views/RecordPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: () => import('@/views/StatisticPage.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守衛：檢查登入狀態
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
