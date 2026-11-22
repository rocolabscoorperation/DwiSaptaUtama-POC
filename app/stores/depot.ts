import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Depot } from '~~/shared/types'
import { mockDepots } from '~/mocks/depots'
import { useAuthStore } from './auth'

export const useDepotStore = defineStore('depot', () => {
  const authStore = useAuthStore()
  const depots = ref<Depot[]>(mockDepots)
  const selectedDepotId = ref<string>('ALL')

  const availableDepots = computed(() => {
    const user = authStore.currentUser
    if (!user) return []
    if (user.role === 'super_admin' || user.role === 'owner' || user.depotIds.includes('DEP-001') && user.depotIds.includes('DEP-002')) {
      return depots.value
    }
    return depots.value.filter((d) => user.depotIds.includes(d.id))
  })

  const currentDepot = computed(() => {
    if (selectedDepotId.value === 'ALL') return null
    return depots.value.find((d) => d.id === selectedDepotId.value) || null
  })

  const canViewAllDepots = computed(() => {
    const user = authStore.currentUser
    if (!user) return false
    return user.role === 'super_admin' || user.role === 'owner'
  })

  const setDepot = (id: string) => {
    if (id === 'ALL' && !canViewAllDepots.value) {
      // fallback to first allowed depot
      const first = availableDepots.value[0]?.id || 'DEP-001'
      selectedDepotId.value = first
      return
    }
    selectedDepotId.value = id
  }

  // Auto-sync depot selection when user changes
  const checkDepotPermission = () => {
    const user = authStore.currentUser
    if (!user) return
    if (!canViewAllDepots.value && selectedDepotId.value === 'ALL') {
      selectedDepotId.value = user.depotIds[0] || 'DEP-001'
    } else if (!canViewAllDepots.value && !user.depotIds.includes(selectedDepotId.value)) {
      selectedDepotId.value = user.depotIds[0] || 'DEP-001'
    }
  }

  return {
    depots,
    selectedDepotId,
    currentDepot,
    availableDepots,
    canViewAllDepots,
    setDepot,
    checkDepotPermission
  }
})

