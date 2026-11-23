<script setup lang="ts">
import { useAppBreadcrumbs } from '~/composables/useBreadcrumbs'
import { ChevronRight, Home } from 'lucide-vue-next'

const { breadcrumbs } = useAppBreadcrumbs()
</script>

<template>
  <nav class="flex items-center gap-1 text-[13px] text-[#556B82] overflow-x-auto py-0.5">
    <NuxtLink
      to="/dashboard"
      class="flex items-center gap-1 text-[#556B82] hover:text-[#0070F2] transition-colors shrink-0"
    >
      <Home class="w-3.5 h-3.5" />
      <span>Beranda</span>
    </NuxtLink>

    <template v-for="(item, idx) in breadcrumbs.slice(1)" :key="idx">
      <ChevronRight class="w-3 h-3 text-[#8FA3B8] shrink-0" />
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-[#0070F2] transition-colors truncate shrink-0"
      >
        {{ item.label }}
      </NuxtLink>
      <span
        v-else
        class="font-semibold text-[#1D2024] truncate shrink-0"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
