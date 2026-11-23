<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  size?: 'sm' | 'md'
}>()

const badgeConfig = computed(() => {
  const s = props.status?.toLowerCase() || ''

  if (['selesai', 'diterima penuh', 'lunas', 'aman', 'posted', 'active', 'terkirim & diterima', 'lancar'].includes(s)) {
    return { bg: 'bg-[#F0FAF4] text-[#256F3A] border-[#86CFAC]', dot: 'bg-[#256F3A]' }
  }
  if ([
    'menipis', 'sebagian diterima', 'belum dibayar', 'sebagian dibayar',
    'dalam transit', 'diproses', 'menunggu persetujuan', 'dalam pengiriman', 'diajukan'
  ].includes(s)) {
    return { bg: 'bg-[#FFF8EB] text-[#915B00] border-[#F6C860]', dot: 'bg-[#D97706]' }
  }
  if (['kritis', 'jatuh tempo', 'ditolak', 'dibatalkan', 'inactive', 'rusak/cacat', 'gagal kirim'].includes(s)) {
    return { bg: 'bg-[#FFF0EF] text-[#AA0808] border-[#FCBCBB]', dot: 'bg-[#AA0808]' }
  }
  if (['disetujui', 'corporate', 'reseller', 'transfer bank', 'siap dikirim'].includes(s)) {
    return { bg: 'bg-[#EEF4FF] text-[#0057BC] border-[#BADAFF]', dot: 'bg-[#0070F2]' }
  }
  return { bg: 'bg-[#F5F6F8] text-[#556B82] border-[#E0E5EB]', dot: 'bg-[#8FA3B8]' }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-semibold border rounded leading-none transition-colors"
    :class="[
      badgeConfig.bg,
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'
    ]"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="badgeConfig.dot" />
    <span>{{ status }}</span>
  </span>
</template>
