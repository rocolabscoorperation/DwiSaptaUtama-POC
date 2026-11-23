<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string
  subtitle?: string
  trend?: {
    value: string
    isUp?: boolean
    neutral?: boolean
  }
  badge?: string
  accentColor?: 'blue' | 'emerald' | 'amber' | 'slate'
}>()

const accentLeft = computed(() => {
  switch (props.accentColor) {
    case 'emerald': return '#16A34A'
    case 'amber':   return '#D97706'
    case 'slate':   return '#64748B'
    case 'blue':
    default:        return '#0070F2'
  }
})
</script>

<template>
  <div
    class="bg-white p-4 transition-shadow hover:shadow-sm relative overflow-hidden cursor-default"
    style="border: 1px solid #E0E5EB; border-radius: 6px;"
  >
    <!-- Left accent bar -->
    <div
      class="absolute left-0 top-0 bottom-0 w-[3px]"
      :style="{ background: accentLeft }"
    />

    <div class="pl-1">
      <!-- Title row -->
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <span class="text-[11px] font-semibold text-[#556B82] leading-none truncate">
          {{ title }}
        </span>
        <span
          v-if="badge"
          class="text-[10px] font-semibold px-1.5 py-0.5 bg-[#F5F6F8] text-[#556B82] rounded border border-[#E0E5EB] shrink-0"
        >
          {{ badge }}
        </span>
      </div>

      <!-- Value -->
      <div class="text-[22px] font-bold text-[#1D2024] leading-none tabular-nums tracking-tight font-mono">
        {{ value }}
      </div>

      <!-- Footer -->
      <div
        v-if="subtitle || trend"
        class="mt-2.5 pt-2 flex items-center justify-between gap-2"
        style="border-top: 1px solid #EEF1F5;"
      >
        <span class="text-[11px] text-[#556B82] truncate">{{ subtitle }}</span>
        <span
          v-if="trend"
          class="text-[11px] font-semibold shrink-0"
          :class="trend.neutral ? 'text-[#556B82]' : (trend.isUp ? 'text-[#256F3A]' : 'text-[#AA0808]')"
        >
          {{ trend.value }}
        </span>
      </div>
    </div>
  </div>
</template>
