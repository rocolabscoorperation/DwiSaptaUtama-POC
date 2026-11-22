<script setup lang="ts">
import { computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import MetricCard from '~/components/shared/MetricCard.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import { FileDown } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()

const totalValuation = computed(() => {
  return erpStore.filteredStock.reduce((acc, it) => acc + it.stockValue, 0)
})

const totalUnits = computed(() => {
  return erpStore.filteredStock.reduce((acc, it) => acc + it.quantity, 0)
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Laporan Persediaan & Valuasi Stok (Inventory Reports)"
      subtitle="Analisis nilai buku aset inventaris, ketersediaan fisik per lokasi gudang, dan rasio perputaran barang."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <FileDown class="w-3.5 h-3.5" />
          <span>Export Excel / PDF</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <MetricCard
        title="Total Valuasi Persediaan"
        :value="formatRupiah(totalValuation)"
        subtitle="Nilai buku persediaan gudang"
        accent-color="blue"
      />
      <MetricCard
        title="Total Fisik Barang"
        :value="`${formatNumber(totalUnits)} Satuan`"
        subtitle="Galon isi, kosong, & karton"
        accent-color="emerald"
      />
      <MetricCard
        title="Item Kritis / Menipis"
        :value="`${erpStore.lowStockAlerts.length} SKU`"
        subtitle="Perlu pengadaan ulang"
        accent-color="amber"
      />
    </div>

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="p-3 bg-slate-50/80 border-b border-slate-200">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Tabel Valuasi & Posisi Stok Fisik Aktual
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">Kode SKU</th>
              <th class="py-2.5 px-3">Nama Produk</th>
              <th class="py-2.5 px-3">Kategori</th>
              <th class="py-2.5 px-3">Depot</th>
              <th class="py-2.5 px-3 text-right">Kuantitas Fisik</th>
              <th class="py-2.5 px-3 text-right">Batas Min</th>
              <th class="py-2.5 px-3 text-right">Harga Perolehan (HPP)</th>
              <th class="py-2.5 px-3 text-right">Total Nilai Buku</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in erpStore.filteredStock"
              :key="`${item.depotId}-${item.productId}`"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ item.sku }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ item.productName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ item.category }}
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ item.depotName }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatNumber(item.quantity) }} {{ item.unit }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-500">
                {{ formatNumber(item.minStock) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-700">
                {{ formatRupiah(item.purchasePrice) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-blue-900">
                {{ formatRupiah(item.stockValue) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="item.status" size="sm" />
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 border-t border-slate-200 font-bold font-mono text-xs">
            <tr>
              <td colspan="7" class="py-2.5 px-3 text-right uppercase text-[10px] font-sans text-slate-500">
                Total Nilai Inventaris:
              </td>
              <td class="py-2.5 px-3 text-right text-[#0f3b6c] text-sm">
                {{ formatRupiah(totalValuation) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
