<script setup lang="ts">
import { useDepotStore } from '~/stores/depot'
import { Building2 } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
  showDepotTag?: boolean
}>()

const depotStore = useDepotStore()
</script>

<template>
  <div class="mb-4 pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">
          {{ title }}
        </h1>
        <div
          v-if="showDepotTag"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
        >
          <Building2 class="w-3.5 h-3.5 text-slate-500" />
          <span>{{ depotStore.selectedDepotId === 'ALL' ? 'Semua Depot' : depotStore.currentDepot?.name }}</span>
        </div>
      </div>
      <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
