<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-slate-200 rounded">
    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
      <Inbox class="w-5 h-5" />
    </div>
    <h4 class="text-sm font-semibold text-slate-700">
      {{ title || 'Tidak ada data ditemukan' }}
    </h4>
    <p class="text-xs text-slate-500 max-w-sm mt-1">
      {{ description || 'Belum ada catatan yang sesuai dengan filter atau konteks depot yang dipilih.' }}
    </p>
  </div>
</template>
