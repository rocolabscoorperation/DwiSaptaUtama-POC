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

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'LayoutDashboard': return LayoutDashboard
    case 'Database': return Database
    case 'ShoppingBag': return ShoppingBag
    case 'Warehouse': return Warehouse
    case 'Truck': return Truck
    case 'Landmark': return Landmark
    case 'FileBarChart': return FileBarChart
    case 'Settings': return Settings
    default: return LayoutDashboard
  }
}

const visibleMenus = computed(() => {
  const user = authStore.currentUser
  if (!user) return []
  return NAVIGATION_MENU.filter((item) => {
    if (user.role === 'super_admin') return true
    return item.roles.includes(user.role)
  }).map((item) => {
    if (!item.children) return item
    const filteredChildren = item.children.filter((child) => {
      if (user.role === 'super_admin') return true
      return child.roles.includes(user.role)
    })
    return { ...item, children: filteredChildren }
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
    <!-- Mobile backdrop -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-[#0A1628]/70 z-40 lg:hidden"
      @click="emit('closeMobile')"
    />

    <!-- Sidebar container -->
    <aside
      class="fixed lg:static top-0 bottom-0 left-0 z-50 h-screen lg:h-full flex flex-col shrink-0 overflow-hidden transition-all duration-200"
      style="background: #0E2748; border-right: 1px solid #1A3B64;"
      :class="[
        mobileOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'lg:w-14' : 'lg:w-60'
      ]"
    >
      <!-- Mobile header row -->
      <div
        class="h-12 px-3 flex items-center justify-between lg:hidden"
        style="border-bottom: 1px solid #1A3B64; background: #0A1628;"
      >
        <span class="text-sm font-bold text-white">Navigasi</span>
        <button type="button" class="text-[#7FB3E0] hover:text-white p-1" @click="emit('closeMobile')">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Nav list -->
      <nav class="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
        <template v-for="menu in visibleMenus" :key="menu.id">
          <!-- Single link (Dashboard) -->
          <NuxtLink
            v-if="menu.to"
            :to="menu.to"
            class="flex items-center gap-2.5 px-2.5 py-2 rounded text-sm font-medium transition-colors duration-100 group relative"
            :class="[
              isActiveParent(menu)
                ? 'bg-[#0070F2] text-white'
                : 'text-[#A8C8E8] hover:bg-[#163552] hover:text-white'
            ]"
            :title="collapsed ? menu.label : undefined"
            @click="emit('closeMobile')"
          >
            <component :is="getIconComponent(menu.icon)" class="w-4 h-4 shrink-0" />
            <span v-if="!collapsed" class="truncate leading-none">{{ menu.label }}</span>

            <!-- Collapsed tooltip -->
            <span
              v-if="collapsed"
              class="hidden lg:group-hover:block absolute left-full ml-2 px-2.5 py-1.5 bg-[#0A1628] text-white text-xs rounded whitespace-nowrap z-50 shadow-lg border border-[#1A3B64]"
            >
              {{ menu.label }}
            </span>
          </NuxtLink>

          <!-- Group with children -->
          <div v-else class="space-y-0.5">
            <button
              type="button"
              class="w-full flex items-center justify-between px-2.5 py-2 rounded text-sm font-medium transition-colors duration-100 group relative cursor-pointer"
              :class="[
                isActiveParent(menu)
                  ? 'bg-[#163552] text-white'
                  : 'text-[#A8C8E8] hover:bg-[#163552] hover:text-white'
              ]"
              :title="collapsed ? menu.label : undefined"
              @click="toggleSubmenu(menu.id)"
            >
              <div class="flex items-center gap-2.5 truncate">
                <component :is="getIconComponent(menu.icon)" class="w-4 h-4 shrink-0 text-[#5B9DD4]" />
                <span v-if="!collapsed" class="truncate leading-none">{{ menu.label }}</span>
              </div>
              <ChevronDown
                v-if="!collapsed"
                class="w-3.5 h-3.5 text-[#5B9DD4] transition-transform shrink-0"
                :class="{ 'rotate-180': openMenus[menu.id] }"
              />

              <!-- Collapsed tooltip -->
              <span
                v-if="collapsed"
                class="hidden lg:group-hover:block absolute left-full ml-2 px-2.5 py-1.5 bg-[#0A1628] text-white text-xs rounded whitespace-nowrap z-50 shadow-lg border border-[#1A3B64]"
              >
                {{ menu.label }}
              </span>
            </button>

            <!-- Submenu -->
            <div
              v-if="!collapsed && openMenus[menu.id]"
              class="ml-6 mr-1 space-y-0.5"
            >
              <NuxtLink
                v-for="child in menu.children"
                :key="child.id"
                :to="child.to"
                class="block px-2.5 py-1.5 rounded text-xs font-medium transition-colors duration-100 truncate"
                :class="[
                  isActiveChild(child.to)
                    ? 'bg-[#0070F2]/80 text-white'
                    : 'text-[#7FB3E0] hover:text-white hover:bg-[#163552]'
                ]"
                @click="emit('closeMobile')"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <!-- Sidebar footer -->
      <div
        v-if="!collapsed"
        class="px-3 py-2.5"
        style="border-top: 1px solid #1A3B64; background: #091E3A;"
      >
        <div class="text-[11px] font-bold text-[#5B9DD4] uppercase tracking-wider leading-none">PT Dwi Sapta Utama</div>
        <div class="text-[10px] text-[#3B6E9C] mt-0.5">Distributor Resmi Aqua · v1.0-poc</div>
      </div>
    </aside>
  </div>
</template>
