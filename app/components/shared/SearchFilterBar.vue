<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="bg-white p-2.5 rounded border border-slate-200 mb-3 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
    <div class="relative flex-1 min-w-[240px]">
      <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <Search class="w-4 h-4" />
      </div>
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder || 'Cari nomor dokumen, produk, atau nama...'"
        class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex items-center gap-2 overflow-x-auto shrink-0">
      <slot name="filters" />
    </div>
  </div>
</template>
