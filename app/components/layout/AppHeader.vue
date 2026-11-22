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
  <header class="bg-[#0b2447] text-white border-b border-slate-700/60 sticky top-0 z-30 shadow-xs">
    <div class="h-13 px-3 sm:px-4 flex items-center justify-between gap-3">
      <!-- Left: Sidebar Toggle + Title -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-hidden"
          title="Buka/Tutup Menu Navigasi"
          @click="emit('toggleSidebar')"
        >
          <Menu class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2">
          <div>
            <div class="text-sm font-bold tracking-tight text-white leading-none">
              DWI SAPTA UTAMA
            </div>
            <div class="text-xs text-blue-200 tracking-wider uppercase font-medium leading-tight mt-0.5">
              Aqua Distribution ERP
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Depot Context Indicator -->
      <div class="flex items-center">
        <DepotSelector />
      </div>

      <!-- Right: Notifications & User Menu -->
      <div class="flex items-center gap-2">
        <!-- Notification Bell -->
        <button
          type="button"
          class="relative p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Notifikasi Operasional"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        <div class="h-5 w-px bg-slate-700" />

        <!-- User Menu -->
        <UserMenu />
      </div>
    </div>

    <!-- Secondary bar for Breadcrumbs on desktop/tablet -->
    <div class="hidden sm:flex bg-slate-100 border-t border-slate-200 px-4 py-1.5 items-center justify-between">
      <AppBreadcrumb />
    </div>
  </header>
</template>
