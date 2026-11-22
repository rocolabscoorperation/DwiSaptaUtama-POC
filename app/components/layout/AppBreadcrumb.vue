<script setup lang="ts">
import { useAppBreadcrumbs } from '~/composables/useBreadcrumbs'
import { ChevronRight, Home } from 'lucide-vue-next'

const { breadcrumbs } = useAppBreadcrumbs()
</script>

<template>
  <nav class="flex items-center text-xs text-slate-500 space-x-1 overflow-x-auto py-1">
    <NuxtLink
      to="/dashboard"
      class="flex items-center text-slate-500 hover:text-slate-800 transition-colors shrink-0"
    >
      <Home class="w-3.5 h-3.5 mr-1" />
      <span>Beranda</span>
    </NuxtLink>

    <template v-for="(item, idx) in breadcrumbs.slice(1)" :key="idx">
      <ChevronRight class="w-3 h-3 text-slate-400 shrink-0" />
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-slate-800 transition-colors truncate shrink-0"
      >
        {{ item.label }}
      </NuxtLink>
      <span
        v-else
        class="font-medium text-slate-800 truncate shrink-0"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
