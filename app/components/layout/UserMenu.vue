<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useDepotStore } from '~/stores/depot'
import { ChevronDown, Shield, RefreshCw, Check, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const depotStore = useDepotStore()
const router = useRouter()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => { isOpen.value = !isOpen.value }

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isOpen.value = false
}

const handleSwitchRole = (role: string) => {
  authStore.switchRole(role)
  depotStore.checkDepotPermission()
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors hover:bg-[#1B4A8A]"
      @click="toggle"
    >
      <!-- Avatar -->
      <div class="w-7 h-7 rounded-full bg-[#0070F2] border-2 border-[#3B8FE0] text-white flex items-center justify-center font-bold text-xs uppercase">
        {{ authStore.currentUser?.name?.slice(0, 2) || 'AD' }}
      </div>
      <div class="hidden md:block text-left leading-tight">
        <div class="text-sm font-semibold text-white truncate max-w-[130px] leading-none">
          {{ authStore.currentUser?.name?.split(' ')[0] || 'User' }}
        </div>
        <div class="text-[10px] text-[#7FB3E0] truncate max-w-[130px] leading-none mt-0.5">
          {{ authStore.currentUser?.roleName }}
        </div>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-[#7FB3E0] hidden sm:block transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-1.5 w-72 bg-white rounded-md z-50 overflow-hidden"
      style="border: 1px solid #E0E5EB; box-shadow: 0 8px 24px rgba(0,0,0,.12);"
    >
      <!-- Profile header -->
      <div class="px-4 py-3 bg-[#F5F6F8] border-b border-[#E0E5EB]">
        <div class="text-sm font-bold text-[#1D2024]">{{ authStore.currentUser?.name }}</div>
        <div class="text-xs text-[#556B82] mt-0.5">{{ authStore.currentUser?.email }}</div>
        <div class="mt-2 flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#EEF4FF] text-[#0070F2] border border-[#BADAFF]">
            <Shield class="w-3 h-3" />
            {{ authStore.currentUser?.roleName }}
          </span>
          <span class="text-[11px] text-[#556B82]">
            {{ authStore.currentUser?.depotIds.length === 2 ? 'Semua Depot' : 'Depot Khusus' }}
          </span>
        </div>
      </div>

      <!-- Role switcher -->
      <div class="px-3 py-2.5 border-b border-[#E0E5EB]">
        <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#556B82] mb-2">
          <RefreshCw class="w-3 h-3" />
          Simulasi Ganti Peran
        </div>
        <div class="space-y-0.5 max-h-44 overflow-y-auto">
          <button
            v-for="account in authStore.demoAccounts"
            :key="account.id"
            type="button"
            class="w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors cursor-pointer"
            :class="authStore.currentUser?.role === account.role ? 'bg-[#EEF4FF] text-[#0070F2] font-semibold' : 'hover:bg-[#F5F6F8] text-[#1D2024]'"
            @click="handleSwitchRole(account.role)"
          >
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="font-medium leading-none">{{ account.roleName }}</div>
                <div class="text-[11px] text-[#556B82] font-normal mt-0.5 font-mono">{{ account.email }}</div>
              </div>
              <Check v-if="authStore.currentUser?.role === account.role" class="w-3.5 h-3.5 shrink-0" />
            </div>
          </button>
        </div>
      </div>

      <!-- Logout -->
      <div class="p-2">
        <button
          type="button"
          class="w-full text-left px-3 py-2 rounded text-sm text-[#AA0808] hover:bg-[#FFF0EF] font-medium flex items-center gap-2 transition-colors cursor-pointer"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4" />
          Keluar dari Sistem
        </button>
      </div>
    </div>
  </div>
</template>
