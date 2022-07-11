import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/signin',
      name: 'signIn',
      component: () => import('../views/SignIn.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.isSignedIn && !useUserStore().isSignedIn) {
    next({
      name: 'signIn',
      query: {
        continueUrl: to.fullPath
      }
    })
  } else next()
})

export default router
