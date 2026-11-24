<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatRupiah } = useCurrency()

const searchQuery = ref('')
const selectedStatus = ref('ALL')

const statuses = ['ALL', 'Belum Dibayar', 'Lunas']

const filteredInvoices = computed(() => {
  return erpStore.filteredSalesInvoices.filter((inv) => {
    const matchQuery =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.soNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus =
      selectedStatus.value === 'ALL' || inv.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Faktur Penjualan (Invoices)"
      subtitle="Tagihan komersial penjualan Aqua kepada pelanggan korporat dan toko reseller."
      show-depot-tag
    />

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor faktur, nomor SO, atau nama pelanggan..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-[#425B73] font-medium">Status Bayar:</span>
          <select
            v-model="selectedStatus"
            class="px-2 py-1 text-xs bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="st in statuses" :key="st" :value="st">
              {{ st === 'ALL' ? 'Semua Status' : st }}
            </option>
          </select>
        </div>
      </template>
    </SearchFilterBar>

    <div class="bg-white border border-[#EAF0F5] rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-[#EAF0F5] uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Faktur</th>
              <th class="py-2.5 px-3">Ref. SO</th>
              <th class="py-2.5 px-3">Ref. DO</th>
              <th class="py-2.5 px-3">Pelanggan</th>
              <th class="py-2.5 px-3">Tgl Faktur</th>
              <th class="py-2.5 px-3">Jatuh Tempo</th>
              <th class="py-2.5 px-3 text-right">Total Tagihan</th>
              <th class="py-2.5 px-3 text-right">Sudah Dibayar</th>
              <th class="py-2.5 px-3 text-right">Sisa Piutang</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="inv in filteredInvoices"
              :key="inv.id"
              class="hover:bg-[#F5F7FA] transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ inv.invoiceNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-[#1D2024]">
                {{ inv.soNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-[#425B73]">
                {{ inv.doNumber }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ inv.customerName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(inv.invoiceDate) }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(inv.dueDate) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-[#1D2024]">
                {{ formatRupiah(inv.totalAmount) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                {{ formatRupiah(inv.paidAmount) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold" :class="inv.outstandingAmount > 0 ? 'text-amber-700' : 'text-[#647B91]'">
                {{ formatRupiah(inv.outstandingAmount) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="inv.status" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredInvoices.length === 0"
        title="Tidak ada faktur penjualan ditemukan"
      />
    </div>
  </div>
</template>
