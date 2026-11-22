<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
  >
    <div class="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
      <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2 text-rose-700">
          <AlertTriangle class="w-4 h-4" />
          <h3 class="text-xs font-bold uppercase tracking-wider">
            {{ title || 'Konfirmasi Penghapusan' }}
          </h3>
        </div>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600"
          @click="emit('cancel')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-4 text-xs text-slate-600 leading-relaxed">
        {{ message }}
      </div>

      <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          @click="emit('cancel')"
        >
          {{ cancelText || 'Batal' }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors shadow-xs"
          @click="emit('confirm')"
        >
          {{ confirmText || 'Ya, Hapus Data' }}
        </button>
      </div>
    </div>
  </div>
</template>
