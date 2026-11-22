import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'
import { NAVIGATION_MENU } from '~~/shared/constants/menu'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') {
    return
  }

  const authStore = useAuthStore()

  // In simulated PoC, if not logged in, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check role authorization for this route
  const currentRole = authStore.currentUser?.role
  if (currentRole === 'super_admin') {
    return // Super admin can access everything
  }

  // Find matching menu item or child
  for (const menu of NAVIGATION_MENU) {
    if (menu.to && to.path.startsWith(menu.to)) {
      if (!menu.roles.includes(currentRole!)) {
        return navigateTo('/dashboard')
      }
    }
    if (menu.children) {
      for (const child of menu.children) {
        if (to.path === child.to || to.path.startsWith(child.to + '/')) {
          if (!child.roles.includes(currentRole!)) {
            return navigateTo('/dashboard')
          }
        }
      }
    }
  }
})

