<script setup lang="ts">
import { Menu, Bell } from 'lucide-vue-next'
import DepotSelector from './DepotSelector.vue'
import UserMenu from './UserMenu.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'

defineProps<{
  sidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleSidebar'): void
}>()
</script>

<template>
  <header class="bg-[#113261] text-white sticky top-0 z-30 border-b border-[#1E4A80]">
    <!-- Shell Bar -->
    <div class="h-12 px-3 sm:px-4 flex items-center justify-between gap-3">
      <!-- Left: Toggle + Brand -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          type="button"
          class="p-1.5 rounded hover:bg-[#1B4A8A] text-[#A8C8E8] hover:text-white transition-colors cursor-pointer"
          title="Buka/Tutup Navigasi"
          @click="emit('toggleSidebar')"
        >
          <Menu class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2.5">
          <!-- Brand mark -->
          <div class="w-7 h-7 bg-[#0070F2] rounded flex items-center justify-center font-black text-white text-xs tracking-widest shrink-0">
            AQ
          </div>
          <div class="hidden sm:block">
            <div class="text-sm font-bold text-white leading-none tracking-tight">
              Dwi Sapta Utama
            </div>
            <div class="text-[10px] text-[#7FB3E0] leading-none mt-0.5 tracking-wide">
              Aqua Distribution · ERP
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Depot Selector -->
      <div class="flex items-center">
        <DepotSelector />
      </div>

      <!-- Right: Notifications + User -->
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="relative p-1.5 rounded hover:bg-[#1B4A8A] text-[#A8C8E8] hover:text-white transition-colors cursor-pointer"
          title="Notifikasi"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>

        <div class="w-px h-5 bg-[#1E4A80]" />

        <UserMenu />
      </div>
    </div>

    <!-- Breadcrumb Bar -->
    <div class="hidden sm:flex bg-[#F5F6F8] border-t border-[#E0E5EB] px-4 py-1.5 items-center justify-between">
      <AppBreadcrumb />
      <div class="text-[11px] text-[#556B82] font-mono">
        Sistem: <span class="text-emerald-600 font-semibold">● Online</span>
      </div>
    </div>
  </header>
</template>
