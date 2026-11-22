<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { Package, AlertTriangle, ArrowRightLeft } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()

const searchQuery = ref('')
const selectedStatus = ref('ALL')

const statuses = ['ALL', 'Aman', 'Menipis', 'Kritis']

const filteredStock = computed(() => {
  return erpStore.filteredStock.filter((item) => {
    const matchQuery =
      item.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.depotName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus =
      selectedStatus.value === 'ALL' || item.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Ringkasan Stok Persediaan (Stock Overview)"
      subtitle="Kondisi kuantitas fisik aktual, nilai persediaan, dan batas minimum stok gudang."
      show-depot-tag
    >
      <template #actions>
        <NuxtLink
          to="/inventory/transfers"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <ArrowRightLeft class="w-3.5 h-3.5" />
          <span>Transfer Antar Depot</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nama produk, SKU, atau depot..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-slate-500 font-medium">Status Stok:</span>
          <select
            v-model="selectedStatus"
            class="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="st in statuses" :key="st" :value="st">
              {{ st === 'ALL' ? 'Semua Status' : st }}
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
              <th class="py-2.5 px-3">SKU</th>
              <th class="py-2.5 px-3">Nama Produk</th>
              <th class="py-2.5 px-3">Kategori</th>
              <th class="py-2.5 px-3">Depot Lokasi</th>
              <th class="py-2.5 px-3 text-right">Stok Fisik Tersedia</th>
              <th class="py-2.5 px-3 text-right">Ambang Min.</th>
              <th class="py-2.5 px-3 text-right">Harga Pokok</th>
              <th class="py-2.5 px-3 text-right">Nilai Total Persediaan</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredStock"
              :key="`${item.depotId}-${item.productId}`"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ item.sku }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ item.productName }}
              </td>
              <td class="py-2.5 px-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                  {{ item.category }}
                </span>
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ item.depotName }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                {{ formatNumber(item.quantity) }} <span class="text-xs font-normal text-slate-500">{{ item.unit }}</span>
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-500">
                {{ formatNumber(item.minStock) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-700">
                {{ formatRupiah(item.purchasePrice) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-[#0f3b6c]">
                {{ formatRupiah(item.stockValue) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="item.status" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredStock.length === 0"
        title="Tidak ada data persediaan"
      />
    </div>
  </div>
</template>
