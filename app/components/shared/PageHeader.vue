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
  <div class="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
    <div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <h1 class="text-xl font-bold text-[#1D2024] leading-tight tracking-tight">
          {{ title }}
        </h1>
        <div
          v-if="showDepotTag"
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-[#EEF4FF] text-[#0070F2] border border-[#BADAFF]"
        >
          <Building2 class="w-3.5 h-3.5" />
          <span>{{ depotStore.selectedDepotId === 'ALL' ? 'Semua Depot' : depotStore.currentDepot?.name }}</span>
        </div>
      </div>
      <p v-if="subtitle" class="text-sm text-[#556B82] mt-1 leading-snug">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
