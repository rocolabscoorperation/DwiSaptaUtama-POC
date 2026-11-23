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
  <div
    class="bg-white px-3 py-2.5 mb-3 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between"
    style="border: 1px solid #E0E5EB; border-radius: 6px;"
  >
    <!-- Search -->
    <div class="relative flex-1 min-w-[200px]">
      <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8FA3B8]">
        <Search class="w-4 h-4" />
      </div>
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder || 'Cari nomor dokumen, nama, atau produk...'"
        class="fiori-input pl-8"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Filter slot -->
    <div class="flex items-center gap-2 overflow-x-auto shrink-0">
      <slot name="filters" />
    </div>
  </div>
</template>
