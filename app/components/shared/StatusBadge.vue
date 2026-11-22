<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  size?: 'sm' | 'md'
}>()

const badgeConfig = computed(() => {
  const s = props.status?.toLowerCase() || ''

  // Success variants
  if (
    ['selesai', 'diterima penuh', 'lunas', 'aman', 'posted', 'active', 'terkirim & diterima', 'lancar'].includes(s)
  ) {
    return {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-600'
    }
  }

  // Warning variants
  if (
    [
      'menipis',
      'sebagian diterima',
      'belum dibayar',
      'sebagian dibayar',
      'dalam transit',
      'diproses',
      'menunggu persetujuan',
      'dalam pengiriman',
      'diajukan'
    ].includes(s)
  ) {
    return {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-600'
    }
  }

  // Danger / Error variants
  if (['kritis', 'jatuh tempo', 'ditolak', 'dibatalkan', 'inactive', 'rusak/cacat', 'gagal kirim'].includes(s)) {
    return {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      dot: 'bg-rose-600'
    }
  }

  // Info / Sky variants
  if (['disetujui', 'corporate', 'reseller', 'transfer bank', 'siap dikirim'].includes(s)) {
    return {
      bg: 'bg-sky-50 text-sky-800 border-sky-300',
      dot: 'bg-sky-600'
    }
  }

  // Neutral default
  return {
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-500'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-medium border rounded-full leading-none transition-colors"
    :class="[
      badgeConfig.bg,
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
    ]"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="badgeConfig.dot" />
    <span>{{ status }}</span>
  </span>
</template>
