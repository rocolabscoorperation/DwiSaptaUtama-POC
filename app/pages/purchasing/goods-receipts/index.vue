<script setup lang="ts">
import { ref, computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import { CheckCircle2, PackageCheck } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatNumber } = useCurrency()

const searchQuery = ref('')

const filteredReceipts = computed(() => {
  return erpStore.filteredGoodsReceipts.filter((gr) => {
    return (
      gr.grNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gr.poNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gr.supplierName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gr.receivedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Penerimaan Barang (Goods Receipts)"
      subtitle="Verifikasi fisik barang masuk dari pabrik Danone ke area penerimaan gudang depot."
      show-depot-tag
    />

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor GR, referensi PO, atau nama penerima..."
    />

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. GR</th>
              <th class="py-2.5 px-3">Ref. PO</th>
              <th class="py-2.5 px-3">Pemasok / Pabrik</th>
              <th class="py-2.5 px-3">Depot Penerima</th>
              <th class="py-2.5 px-3">Tgl Penerimaan</th>
              <th class="py-2.5 px-3">Petugas Gudang</th>
              <th class="py-2.5 px-3">Rincian Fisik Diterima</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="gr in filteredReceipts"
              :key="gr.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ gr.grNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono font-semibold text-slate-700">
                <NuxtLink to="/purchasing/purchase-orders" class="hover:underline text-blue-700">
                  {{ gr.poNumber }}
                </NuxtLink>
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-800">
                {{ gr.supplierName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ gr.depotName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(gr.receiptDate) }}
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ gr.receivedBy }}
              </td>
              <td class="py-2.5 px-3">
                <div class="space-y-0.5">
                  <div
                    v-for="item in gr.items"
                    :key="item.productId"
                    class="flex items-center gap-2 text-[11px]"
                  >
                    <span class="font-medium text-slate-800">{{ item.productName }}:</span>
                    <span class="font-mono font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                      +{{ formatNumber(item.qtyReceived) }}
                    </span>
                    <span class="text-slate-400">({{ item.condition }})</span>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="gr.status" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredReceipts.length === 0"
        title="Tidak ada penerimaan barang ditemukan"
      />
    </div>
  </div>
</template>
