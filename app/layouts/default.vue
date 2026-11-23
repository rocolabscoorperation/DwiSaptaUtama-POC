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
  <div class="min-h-screen flex flex-col bg-[#F5F6F8]">
    <!-- Top Shell Header -->
    <AppHeader
      :sidebar-collapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Body: Sidebar + Content -->
    <div class="flex-1 min-h-0 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <AppSidebar
        :collapsed="sidebarCollapsed"
        :mobile-open="mobileOpen"
        @close-mobile="closeMobile"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto min-w-0">
        <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
