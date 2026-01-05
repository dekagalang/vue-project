/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    ...setupLayouts(routes),
  ],
})

// Route guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage
  authStore.initializeAuth()

  // Public routes that don't need authentication
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  // If user is not authenticated and trying to access protected route
  if (!authStore.isAuthenticated() && !isPublicRoute) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  // If user is authenticated and trying to access login page
  if (authStore.isAuthenticated() && to.path === '/login') {
    next({ path: '/dashboard' })
    return
  }

  next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
