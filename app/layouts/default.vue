<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)

const toggleSidebar = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    mobileOpen.value = !mobileOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const closeMobile = () => {
  mobileOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5f7fa] text-slate-800">
    <!-- Top Header -->
    <AppHeader
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Body Area -->
    <div class="flex-1 min-h-0 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <AppSidebar
        :collapsed="sidebarCollapsed"
        :mobile-open="mobileOpen"
        @close-mobile="closeMobile"
      />

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto px-3 sm:px-5 py-4 min-w-0">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

