<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import MetricCard from '~/components/shared/MetricCard.vue'
import { FileDown, Calendar, Filter } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()

const startDate = ref('2026-11-01')
const endDate = ref('2026-11-30')

const totalSales = computed(() => {
  return erpStore.filteredSalesOrders.reduce((acc, so) => acc + so.totalAmount, 0)
})

const totalUnits = computed(() => {
  return erpStore.filteredSalesOrders.reduce((acc, so) => {
    return acc + so.items.reduce((sum, item) => sum + item.qty, 0)
  }, 0)
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Laporan Penjualan & Distribusi (Sales Reports)"
      subtitle="Rekapitulasi volume penjualan galon dan botol Aqua berdasarkan periode, pelanggan, dan cabang depot."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors"
          @click="alert('Simulasi: Export Laporan Penjualan ke Excel / PDF')"
        >
          <FileDown class="w-3.5 h-3.5" />
          <span>Export Excel / PDF</span>
        </button>
      </template>
    </PageHeader>

    <!-- Filter Bar -->
    <div class="bg-white p-3 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2">
        <Calendar class="w-4 h-4 text-slate-400" />
        <span class="font-medium text-slate-700">Periode:</span>
        <input
          v-model="startDate"
          type="date"
          class="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-xs"
        />
        <span class="text-slate-400">s/d</span>
        <input
          v-model="endDate"
          type="date"
          class="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-xs"
        />
      </div>

      <div class="text-xs text-slate-500 font-mono">
        Total Transaksi Ditemukan: <strong class="text-slate-800">{{ erpStore.filteredSalesOrders.length }} Order</strong>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <MetricCard
        title="Total Omzet Penjualan"
        :value="formatRupiah(totalSales)"
        subtitle="Periode 01 Nov - 30 Nov 2026"
        accent-color="blue"
      />
      <MetricCard
        title="Total Unit Terjual"
        :value="`${formatNumber(totalUnits)} Unit`"
        subtitle="Galon 19L & Dus Botol"
        accent-color="emerald"
      />
      <MetricCard
        title="Rata-rata Nilai Order"
        :value="formatRupiah(erpStore.filteredSalesOrders.length ? totalSales / erpStore.filteredSalesOrders.length : 0)"
        subtitle="Basket size per pesanan"
        accent-color="slate"
      />
    </div>

    <!-- Sales Breakdown Table -->
    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="p-3 bg-slate-50/80 border-b border-slate-200">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Rincian Transaksi Penjualan Per Pelanggan
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. SO</th>
              <th class="py-2.5 px-3">Tanggal</th>
              <th class="py-2.5 px-3">Nama Mitra Pelanggan</th>
              <th class="py-2.5 px-3">Depot</th>
              <th class="py-2.5 px-3">Metode Bayar</th>
              <th class="py-2.5 px-3 text-right">Rincian Volume Item</th>
              <th class="py-2.5 px-3 text-right">Total Tagihan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="so in erpStore.filteredSalesOrders"
              :key="so.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ so.soNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-600">
                {{ so.orderDate }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ so.customerName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ so.depotName }}
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ so.paymentType }}
              </td>
              <td class="py-2.5 px-3 text-right">
                <span v-for="(it, i) in so.items" :key="i" class="inline-block text-[11px] text-slate-600 ml-2">
                  {{ it.qty }} {{ it.productName.split(' ')[1] }}
                </span>
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatRupiah(so.totalAmount) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 border-t border-slate-200 font-bold font-mono text-xs">
            <tr>
              <td colspan="6" class="py-2.5 px-3 text-right uppercase text-[10px] font-sans text-slate-500">
                Total Omzet Terkonsolidasi:
              </td>
              <td class="py-2.5 px-3 text-right text-[#0f3b6c] text-sm">
                {{ formatRupiah(totalSales) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
