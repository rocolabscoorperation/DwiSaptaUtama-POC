<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-6 text-center bg-white" style="border: 1px dashed #E0E5EB; border-radius: 6px;">
    <div class="w-10 h-10 rounded-full bg-[#EEF1F5] flex items-center justify-center text-[#8FA3B8] mb-3">
      <Inbox class="w-5 h-5" />
    </div>
    <h4 class="text-sm font-bold text-[#1D2024]">
      {{ title || 'Belum ada data' }}
    </h4>
    <p class="text-xs text-[#556B82] max-w-xs mt-1.5 leading-relaxed">
      {{ description || 'Belum ada catatan yang sesuai dengan filter atau konteks depot yang dipilih.' }}
    </p>
  </div>
</template>
