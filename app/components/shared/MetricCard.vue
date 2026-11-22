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

const accentBorder = computed(() => {
  switch (props.accentColor) {
    case 'emerald':
      return 'border-t-emerald-600'
    case 'amber':
      return 'border-t-amber-600'
    case 'slate':
      return 'border-t-slate-500'
    case 'blue':
    default:
      return 'border-t-[#0f3b6c]'
  }
})
</script>

<template>
  <div
    class="bg-white border border-slate-200 border-t-2 rounded shadow-xs p-3.5 transition-shadow hover:shadow-sm"
    :class="accentBorder"
  >
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
        {{ title }}
      </span>
      <span
        v-if="badge"
        class="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200"
      >
        {{ badge }}
      </span>
    </div>

    <div class="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums leading-tight">
      {{ value }}
    </div>

    <div v-if="subtitle || trend" class="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
      <span class="truncate">{{ subtitle }}</span>
      <span
        v-if="trend"
        class="font-medium shrink-0"
        :class="trend.neutral ? 'text-slate-500' : (trend.isUp ? 'text-emerald-700' : 'text-rose-700')"
      >
        {{ trend.value }}
      </span>
    </div>
  </div>
</template>
