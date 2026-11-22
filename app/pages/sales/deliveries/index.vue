<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { Truck } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatNumber } = useCurrency()

const searchQuery = ref('')

const filteredDeliveries = computed(() => {
  return erpStore.filteredDeliveryOrders.filter((d) => {
    return (
      d.doNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.soNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.vehiclePlate.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Surat Jalan & Pengiriman (Delivery Orders)"
      subtitle="Manajemen armada pengiriman galon, verifikasi penerimaan di lokasi mitra, dan tanda tangan tanda terima."
      show-depot-tag
    />

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor DO, nomor SO, nama toko/hotel, atau sopir..."
    />

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Surat Jalan</th>
              <th class="py-2.5 px-3">Ref. SO</th>
              <th class="py-2.5 px-3">Pelanggan Tujuan</th>
              <th class="py-2.5 px-3">Depot Asal</th>
              <th class="py-2.5 px-3">Tgl Kirim</th>
              <th class="py-2.5 px-3">Pengemudi & Plat Kendaraan</th>
              <th class="py-2.5 px-3">Muatan Barang</th>
              <th class="py-2.5 px-3">Penerima di Lokasi</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="d in filteredDeliveries"
              :key="d.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ d.doNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono font-semibold text-slate-700">
                <NuxtLink to="/sales/sales-orders" class="text-blue-700 hover:underline">
                  {{ d.soNumber }}
                </NuxtLink>
              </td>
              <td class="py-2.5 px-3">
                <div class="font-semibold text-slate-800">{{ d.customerName }}</div>
                <div class="text-[10px] text-slate-500 truncate max-w-xs">{{ d.customerAddress }}</div>
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ d.depotName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(d.deliveryDate) }}
              </td>
              <td class="py-2.5 px-3">
                <div class="font-medium text-slate-800">{{ d.driverName }}</div>
                <div class="font-mono text-[10px] text-slate-500">{{ d.vehiclePlate }}</div>
              </td>
              <td class="py-2.5 px-3">
                <div class="space-y-0.5">
                  <div
                    v-for="(item, idx) in d.items"
                    :key="idx"
                    class="text-[11px] text-slate-700"
                  >
                    <span>{{ item.productName }}:</span>
                    <span class="font-mono font-bold text-blue-900 ml-1">
                      {{ formatNumber(item.qty) }} {{ item.unit }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-3">
                <div class="font-medium text-slate-800">{{ d.recipientName || '-' }}</div>
                <div v-if="d.receivedTime" class="font-mono text-[10px] text-slate-400">
                  {{ d.receivedTime }}
                </div>
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="d.status" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredDeliveries.length === 0"
        title="Tidak ada surat jalan pengiriman ditemukan"
      />
    </div>
  </div>
</template>
