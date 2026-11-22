import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '~~/shared/types'
import { mockUsers } from '~/mocks/users'

export const useAuthStore = defineStore('auth', () => {
  // Default to Super Admin for seamless client demo presentation
  const currentUser = ref<User | null>({
    id: mockUsers[0].id,
    name: mockUsers[0].name,
    email: mockUsers[0].email,
    role: mockUsers[0].role,
    roleName: mockUsers[0].roleName,
    depotIds: mockUsers[0].depotIds,
    status: mockUsers[0].status,
    phone: mockUsers[0].phone
  })

  const isAuthenticated = computed(() => currentUser.value !== null)

  const demoAccounts = computed(() => mockUsers)

  const login = (email: string, pass: string): boolean => {
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pass
    )
    if (found) {
      currentUser.value = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        roleName: found.roleName,
        depotIds: found.depotIds,
        status: found.status,
        phone: found.phone
      }
      return true
    }
    return false
  }

  const switchUser = (role: UserRole) => {
    const found = mockUsers.find((u) => u.role === role)
    if (found) {
      currentUser.value = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        roleName: found.roleName,
        depotIds: found.depotIds,
        status: found.status,
        phone: found.phone
      }
    }
  }

  const logout = () => {
    currentUser.value = null
  }

  const hasRole = (roles: UserRole[]): boolean => {
    if (!currentUser.value) return false
    if (currentUser.value.role === 'super_admin') return true
    return roles.includes(currentUser.value.role)
  }

  return {
    currentUser,
    isAuthenticated,
    demoAccounts,
    login,
    switchUser,
    logout,
    hasRole
  }
})

