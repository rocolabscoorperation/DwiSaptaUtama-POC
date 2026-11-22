<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import type { StockTransfer } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { ArrowRight, Plus, Trash2, X, Check, ArrowRightLeft } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatNumber } = useCurrency()

// Add Transfer State
const isAddModalOpen = ref(false)
const trfForm = reactive({
  date: new Date().toISOString().split('T')[0],
  sourceDepotId: 'DEP-001',
  targetDepotId: 'DEP-002',
  productId: 'PROD-001',
  qty: 100,
  driverName: 'I Made Budiana',
  vehicleNumber: 'DK 8145 EF (Truk Engkel)',
  notes: 'Penyeimbangan ketersediaan stok Aqua galon antar pangkalan.'
})

const openAddModal = () => {
  trfForm.date = new Date().toISOString().split('T')[0]
  trfForm.sourceDepotId = 'DEP-001'
  trfForm.targetDepotId = 'DEP-002'
  trfForm.productId = erpStore.products[0]?.id || 'PROD-001'
  trfForm.qty = 100
  trfForm.driverName = 'I Made Budiana'
  trfForm.vehicleNumber = 'DK 8145 EF'
  trfForm.notes = 'Penyeimbangan ketersediaan stok.'
  isAddModalOpen.value = true
}

const saveTransfer = () => {
  const prod = erpStore.products.find((p) => p.id === trfForm.productId)!
  const sourceName = trfForm.sourceDepotId === 'DEP-001' ? 'Depot Denpasar' : 'Depot Jimbaran'
  const targetName = trfForm.targetDepotId === 'DEP-001' ? 'Depot Denpasar' : 'Depot Jimbaran'

  erpStore.addStockTransfer({
    date: trfForm.date,
    sourceDepotId: trfForm.sourceDepotId,
    sourceDepotName: sourceName,
    targetDepotId: trfForm.targetDepotId,
    targetDepotName: targetName,
    items: [
      {
        productId: prod.id,
        productName: prod.name,
        qty: Number(trfForm.qty),
        unit: prod.unit
      }
    ],
    status: 'Dalam Transit',
    driverName: trfForm.driverName,
    vehicleNumber: trfForm.vehicleNumber,
    notes: trfForm.notes
  })

  isAddModalOpen.value = false
}

// Delete State
const isDeleteOpen = ref(false)
const trfToDelete = ref<StockTransfer | null>(null)

const promptDelete = (trf: StockTransfer) => {
  trfToDelete.value = trf
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (trfToDelete.value) {
    erpStore.deleteStockTransfer(trfToDelete.value.id)
  }
  isDeleteOpen.value = false
  trfToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Transfer Antar Depot (Inter-Depot Transfers)"
      subtitle="Relokasi stok Aqua Galon dan galon kosong antara Depot Denpasar dan Depot Jimbaran."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Buat Transfer Baru</span>
        </button>
      </template>
    </PageHeader>

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Transfer</th>
              <th class="py-2.5 px-3">Tanggal</th>
              <th class="py-2.5 px-3">Depot Asal (Kirim)</th>
              <th class="py-2.5 px-3 text-center"></th>
              <th class="py-2.5 px-3">Depot Tujuan (Terima)</th>
              <th class="py-2.5 px-3">Rincian Barang</th>
              <th class="py-2.5 px-3">Armada & Pengemudi</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-16">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="trf in erpStore.filteredStockTransfers"
              :key="trf.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ trf.transferNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-600">
                {{ formatDate(trf.date) }}
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-800">
                {{ trf.sourceDepotName }}
              </td>
              <td class="py-2.5 px-3 text-center text-slate-400">
                <ArrowRight class="w-3.5 h-3.5 inline" />
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-800">
                {{ trf.targetDepotName }}
              </td>
              <td class="py-2.5 px-3">
                <div class="space-y-0.5">
                  <div
                    v-for="(item, idx) in trf.items"
                    :key="idx"
                    class="text-[11px] text-slate-700"
                  >
                    <span class="font-semibold">{{ item.productName }}:</span>
                    <span class="font-mono font-bold text-blue-900 ml-1">
                      {{ formatNumber(item.qty) }} {{ item.unit }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-2.5 px-3">
                <div class="text-slate-800 font-medium">{{ trf.driverName }}</div>
                <div class="font-mono text-[10px] text-slate-500">{{ trf.vehicleNumber }}</div>
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="trf.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <button
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Hapus / Batalkan Transfer"
                  @click="promptDelete(trf)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="erpStore.filteredStockTransfers.length === 0"
        title="Tidak ada catatan transfer antar depot"
      />
    </div>

    <!-- Create Transfer Form Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ArrowRightLeft class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Buat Dokumen Transfer Antar Depot</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isAddModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveTransfer">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Depot Asal (Pengirim)</label>
              <select
                v-model="trfForm.sourceDepotId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                @change="trfForm.targetDepotId = trfForm.sourceDepotId === 'DEP-001' ? 'DEP-002' : 'DEP-001'"
              >
                <option value="DEP-001">Depot Denpasar (DPS)</option>
                <option value="DEP-002">Depot Jimbaran (JBR)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Depot Tujuan (Penerima)</label>
              <select
                v-model="trfForm.targetDepotId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option :value="trfForm.sourceDepotId === 'DEP-001' ? 'DEP-002' : 'DEP-001'">
                  {{ trfForm.sourceDepotId === 'DEP-001' ? 'Depot Jimbaran (JBR)' : 'Depot Denpasar (DPS)' }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Produk yang Ditransfer</label>
              <select
                v-model="trfForm.productId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option v-for="p in erpStore.products" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.sku }})
                </option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kuantitas</label>
              <input
                v-model.number="trfForm.qty"
                type="number"
                min="1"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Pengemudi</label>
              <input
                v-model="trfForm.driverName"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                placeholder="I Made Budiana"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">No. Plat Armada</label>
              <input
                v-model="trfForm.vehicleNumber"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
                placeholder="DK 8145 EF"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Pengiriman</label>
            <input
              v-model="trfForm.notes"
              type="text"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              placeholder="Instruksi rute atau kebutuhan mendesak..."
            />
          </div>

          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
              @click="isAddModalOpen = false"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>Simpan & Kirim Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Dokumen Transfer"
      :message="`Apakah Anda yakin ingin membatalkan/menghapus dokumen transfer '${trfToDelete?.transferNumber}'?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
