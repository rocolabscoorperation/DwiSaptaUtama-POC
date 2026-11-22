<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { NAVIGATION_MENU, type MenuItem } from '~~/shared/constants/menu'
import {
  LayoutDashboard,
  Database,
  ShoppingBag,
  Warehouse,
  Truck,
  Landmark,
  FileBarChart,
  Settings,
  ChevronDown,
  X
} from 'lucide-vue-next'

const props = defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'closeMobile'): void
}>()

const route = useRoute()
const authStore = useAuthStore()

// State of expanded menus
const openMenus = ref<Record<string, boolean>>({
  'master-data': true,
  purchasing: true,
  inventory: true,
  sales: true,
  finance: true,
  reports: true,
  settings: false
})

const toggleSubmenu = (menuId: string) => {
  openMenus.value[menuId] = !openMenus.value[menuId]
}

// Icon mapper
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'LayoutDashboard':
      return LayoutDashboard
    case 'Database':
      return Database
    case 'ShoppingBag':
      return ShoppingBag
    case 'Warehouse':
      return Warehouse
    case 'Truck':
      return Truck
    case 'Landmark':
      return Landmark
    case 'FileBarChart':
      return FileBarChart
    case 'Settings':
      return Settings
    default:
      return LayoutDashboard
  }
}

// Filter menus by role
const visibleMenus = computed(() => {
  const user = authStore.currentUser
  if (!user) return []

  return NAVIGATION_MENU.filter((item) => {
    // If super admin, allow all
    if (user.role === 'super_admin') return true
    return item.roles.includes(user.role)
  }).map((item) => {
    if (!item.children) return item
    // Filter sub items
    const filteredChildren = item.children.filter((child) => {
      if (user.role === 'super_admin') return true
      return child.roles.includes(user.role)
    })
    return {
      ...item,
      children: filteredChildren
    }
  })
})

const isActiveParent = (item: MenuItem): boolean => {
  if (item.to && route.path.startsWith(item.to)) return true
  if (item.children) {
    return item.children.some((child) => route.path.startsWith(child.to))
  }
  return false
}

const isActiveChild = (to: string): boolean => {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <div>
    <!-- Mobile Drawer Backdrop -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
      @click="emit('closeMobile')"
    />

    <!-- Sidebar Container -->
    <aside
      class="fixed lg:static top-0 bottom-0 left-0 z-50 h-screen lg:h-full bg-[#0f2744] text-slate-200 border-r border-slate-800 transition-all duration-200 flex flex-col shrink-0 overflow-hidden shadow-lg lg:shadow-none"
      :class="[
        mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'lg:w-16' : 'lg:w-64'
      ]"
    >
      <!-- Mobile Close Header -->
      <div class="h-13 px-4 flex items-center justify-between border-b border-slate-800 lg:hidden bg-[#0b2447]">
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-white">Menu Navigasi ERP</span>
        </div>
        <button
          type="button"
          class="p-1 rounded text-slate-400 hover:text-white"
          @click="emit('closeMobile')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Items List -->
      <div class="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <template v-for="menu in visibleMenus" :key="menu.id">
          <!-- Standalone link (Dashboard) -->
          <NuxtLink
            v-if="menu.to"
            :to="menu.to"
            class="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors group relative"
            :class="[
              isActiveParent(menu)
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            ]"
            :title="collapsed ? menu.label : undefined"
            @click="emit('closeMobile')"
          >
            <component :is="getIconComponent(menu.icon)" class="w-4 h-4 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ menu.label }}</span>

            <!-- Tooltip when collapsed -->
            <span
              v-if="collapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-50 shadow-md"
            >
              {{ menu.label }}
            </span>
          </NuxtLink>

          <!-- Group Menu with Children -->
          <div v-else class="space-y-0.5">
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors group relative"
              :class="[
                isActiveParent(menu)
                  ? 'text-white bg-slate-800/80 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              ]"
              :title="collapsed ? menu.label : undefined"
              @click="toggleSubmenu(menu.id)"
            >
              <div class="flex items-center gap-3 truncate">
                <component :is="getIconComponent(menu.icon)" class="w-4 h-4 shrink-0 text-blue-400" />
                <span v-if="!collapsed" class="truncate">{{ menu.label }}</span>
              </div>
              <ChevronDown
                v-if="!collapsed"
                class="w-3.5 h-3.5 text-slate-400 transition-transform"
                :class="{ 'rotate-180': openMenus[menu.id] }"
              />

              <!-- Tooltip when collapsed -->
              <span
                v-if="collapsed"
                class="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-50 shadow-md"
              >
                {{ menu.label }}
              </span>
            </button>

            <!-- Submenu Items -->
            <div
              v-if="!collapsed && openMenus[menu.id]"
              class="pl-7 pr-1 py-0.5 space-y-0.5"
            >
              <NuxtLink
                v-for="child in menu.children"
                :key="child.id"
                :to="child.to"
                class="block px-2.5 py-1.5 rounded text-xs font-medium transition-colors truncate"
                :class="[
                  isActiveChild(child.to)
                    ? 'bg-blue-600/90 text-white font-medium shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                ]"
                @click="emit('closeMobile')"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>

      <!-- Sidebar Footer (Depot context badge) -->
      <div v-if="!collapsed" class="p-3 border-t border-slate-800 text-xs text-slate-400 bg-[#0a1e36]">
        <div class="font-bold text-slate-300 uppercase tracking-wider mb-0.5">PT DWI SAPTA UTAMA</div>
        <div class="text-xs text-slate-400">Distributor Resmi Aqua Bali</div>
        <div class="text-[11px] text-slate-400 mt-1">v1.0-poc</div>
      </div>
    </aside>
  </div>
</template>
