<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatNumber } = useCurrency()

const searchQuery = ref('')
const selectedType = ref('ALL')

const movementTypes = [
  'ALL',
  'Penerimaan PO (GR)',
  'Pengiriman SO (DO)',
  'Penyesuaian Masuk (Opname)',
  'Penyesuaian Keluar (Rusak)',
  'Transfer Masuk',
  'Transfer Keluar'
]

const filteredMovements = computed(() => {
  return erpStore.filteredStockMovements.filter((m) => {
    const matchQuery =
      m.movementNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.referenceNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.operator.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType =
      selectedType.value === 'ALL' || m.type === selectedType.value
    return matchQuery && matchType
  })
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Mutasi & Kartu Stok (Stock Movements)"
      subtitle="Buku log pergerakan stok keluar masuk barang, traceable hingga referensi dokumen transaksi."
      show-depot-tag
    />

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor mutasi, dokumen acuan, atau produk..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-slate-500 font-medium">Jenis Mutasi:</span>
          <select
            v-model="selectedType"
            class="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="t in movementTypes" :key="t" :value="t">
              {{ t === 'ALL' ? 'Semua Jenis Mutasi' : t }}
            </option>
          </select>
        </div>
      </template>
    </SearchFilterBar>

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Mutasi</th>
              <th class="py-2.5 px-3">Waktu</th>
              <th class="py-2.5 px-3">Jenis Gerakan</th>
              <th class="py-2.5 px-3">Ref. Dokumen</th>
              <th class="py-2.5 px-3">Produk</th>
              <th class="py-2.5 px-3">Depot</th>
              <th class="py-2.5 px-3 text-right">Perubahan Qty</th>
              <th class="py-2.5 px-3 text-right">Sisa Stok Akhir</th>
              <th class="py-2.5 px-3">Petugas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="m in filteredMovements"
              :key="m.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ m.movementNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                {{ m.date }}
              </td>
              <td class="py-2.5 px-3">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="m.qtyChange > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'"
                >
                  <ArrowDownLeft v-if="m.qtyChange > 0" class="w-3 h-3 text-emerald-600" />
                  <ArrowUpRight v-else class="w-3 h-3 text-rose-600" />
                  {{ m.type }}
                </span>
              </td>
              <td class="py-2.5 px-3 font-mono font-medium text-slate-700">
                {{ m.referenceNumber }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ m.productName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ m.depotName }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-xs" :class="m.qtyChange > 0 ? 'text-emerald-700' : 'text-rose-700'">
                {{ m.qtyChange > 0 ? `+${formatNumber(m.qtyChange)}` : formatNumber(m.qtyChange) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatNumber(m.balanceAfter) }} {{ m.unit }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ m.operator }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredMovements.length === 0"
        title="Tidak ada catatan mutasi stok"
      />
    </div>
  </div>
</template>
