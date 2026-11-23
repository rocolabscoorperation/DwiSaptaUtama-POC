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
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: rgba(10,22,40,.65);"
  >
    <div
      class="bg-white w-full max-w-sm overflow-hidden"
      style="border-radius: 6px; border: 1px solid #E0E5EB; box-shadow: 0 16px 40px rgba(0,0,0,.18);"
    >
      <!-- Header -->
      <div class="px-4 py-3 flex items-center justify-between" style="border-bottom: 1px solid #E0E5EB; background: #F5F6F8;">
        <div class="flex items-center gap-2 text-[#AA0808]">
          <AlertTriangle class="w-4 h-4 shrink-0" />
          <span class="text-sm font-bold">{{ title || 'Konfirmasi Penghapusan' }}</span>
        </div>
        <button
          type="button"
          class="text-[#8FA3B8] hover:text-[#1D2024] p-0.5 rounded transition-colors cursor-pointer"
          @click="emit('cancel')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-4 py-4 text-sm text-[#556B82] leading-relaxed">
        {{ message }}
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 flex items-center justify-end gap-2" style="border-top: 1px solid #E0E5EB; background: #F5F6F8;">
        <button type="button" class="btn-secondary" @click="emit('cancel')">
          {{ cancelText || 'Batal' }}
        </button>
        <button type="button" class="btn-danger" @click="emit('confirm')">
          {{ confirmText || 'Ya, Hapus' }}
        </button>
      </div>
    </div>
  </div>
</template>
