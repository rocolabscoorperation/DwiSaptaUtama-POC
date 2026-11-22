<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import type { StockAdjustment } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Plus, Trash2, X, Check, ClipboardEdit } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatNumber } = useCurrency()

// Add Adjustment Modal State
const isAddModalOpen = ref(false)
const adjForm = reactive({
  date: new Date().toISOString().split('T')[0],
  depotId: 'DEP-001',
  productId: 'PROD-001',
  systemQty: 480,
  physicalQty: 475,
  reason: '',
  adjustedBy: 'Ketut Gede Raka (Disetujui: Wayan Suryawan)'
})

// Auto-fill systemQty when depot or product changes
watch(
  [() => adjForm.depotId, () => adjForm.productId],
  ([depotId, prodId]) => {
    const item = erpStore.stockItems.find(
      (it) => it.depotId === depotId && it.productId === prodId
    )
    if (item) {
      adjForm.systemQty = item.quantity
      adjForm.physicalQty = item.quantity
    }
  },
  { immediate: true }
)

const diffQty = computed(() => {
  return Number(adjForm.physicalQty) - Number(adjForm.systemQty)
})

const openAddModal = () => {
  adjForm.depotId = erpStore.activeDepotId === 'ALL' ? 'DEP-001' : erpStore.activeDepotId
  adjForm.productId = erpStore.products[0]?.id || 'PROD-001'
  const item = erpStore.stockItems.find(
    (it) => it.depotId === adjForm.depotId && it.productId === adjForm.productId
  )
  adjForm.systemQty = item ? item.quantity : 100
  adjForm.physicalQty = adjForm.systemQty
  adjForm.reason = 'Temuan opname fisik rutin mingguan gudang.'
  adjForm.date = new Date().toISOString().split('T')[0]
  isAddModalOpen.value = true
}

const saveAdjustment = () => {
  const prod = erpStore.products.find((p) => p.id === adjForm.productId)!
  const depotName = adjForm.depotId === 'DEP-001' ? 'Depot Denpasar' : 'Depot Jimbaran'

  erpStore.addStockAdjustment({
    date: adjForm.date,
    depotId: adjForm.depotId,
    depotName: depotName,
    productId: prod.id,
    productName: prod.name,
    sku: prod.sku,
    systemQty: Number(adjForm.systemQty),
    physicalQty: Number(adjForm.physicalQty),
    diffQty: diffQty.value,
    type: diffQty.value >= 0 ? 'Adjustment In' : 'Adjustment Out',
    reason: adjForm.reason,
    status: 'Disetujui',
    adjustedBy: adjForm.adjustedBy
  })

  isAddModalOpen.value = false
}

// Delete State
const isDeleteOpen = ref(false)
const adjToDelete = ref<StockAdjustment | null>(null)

const promptDelete = (adj: StockAdjustment) => {
  adjToDelete.value = adj
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (adjToDelete.value) {
    erpStore.deleteStockAdjustment(adjToDelete.value.id)
  }
  isDeleteOpen.value = false
  adjToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Stock Opname & Penyesuaian (Stock Adjustments)"
      subtitle="Pencatatan selisih fisik opname berkala, galon pecah/rusak, dan penyesuaian inventaris resmi."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Buat Penyesuaian</span>
        </button>
      </template>
    </PageHeader>

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Penyesuaian</th>
              <th class="py-2.5 px-3">Tanggal</th>
              <th class="py-2.5 px-3">Depot</th>
              <th class="py-2.5 px-3">Produk</th>
              <th class="py-2.5 px-3 text-right">Qty Sistem</th>
              <th class="py-2.5 px-3 text-right">Qty Fisik</th>
              <th class="py-2.5 px-3 text-right">Selisih</th>
              <th class="py-2.5 px-3">Alasan Penyesuaian</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3">Petugas & Approval</th>
              <th class="py-2.5 px-3 text-center w-16">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="adj in erpStore.filteredStockAdjustments"
              :key="adj.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ adj.adjustmentNumber }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 font-mono">
                {{ formatDate(adj.date) }}
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ adj.depotName }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ adj.productName }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-500">
                {{ formatNumber(adj.systemQty) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                {{ formatNumber(adj.physicalQty) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold" :class="adj.diffQty < 0 ? 'text-rose-700' : 'text-emerald-700'">
                {{ adj.diffQty > 0 ? `+${formatNumber(adj.diffQty)}` : formatNumber(adj.diffQty) }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 max-w-xs">
                {{ adj.reason }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="adj.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-slate-500 text-[11px]">
                {{ adj.adjustedBy }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <button
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Hapus Penyesuaian"
                  @click="promptDelete(adj)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="erpStore.filteredStockAdjustments.length === 0"
        title="Tidak ada penyesuaian stok tercatat"
      />
    </div>

    <!-- Create Adjustment Form Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ClipboardEdit class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Catat Stock Opname / Penyesuaian</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isAddModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveAdjustment">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Depot Lokasi</label>
              <select
                v-model="adjForm.depotId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option value="DEP-001">Depot Denpasar (DPS)</option>
                <option value="DEP-002">Depot Jimbaran (JBR)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Opname</label>
              <input
                v-model="adjForm.date"
                type="date"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Pilih Produk</label>
            <select
              v-model="adjForm.productId"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
            >
              <option v-for="p in erpStore.products" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.sku }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-3 gap-3 p-2.5 bg-slate-50 rounded border border-slate-200">
            <div>
              <label class="block text-slate-500 mb-1 font-medium">Stok Sistem</label>
              <div class="font-mono font-bold text-slate-800 text-sm">
                {{ formatNumber(adjForm.systemQty) }}
              </div>
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-semibold">Stok Fisik Aktual</label>
              <input
                v-model.number="adjForm.physicalQty"
                type="number"
                min="0"
                required
                class="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label class="block text-slate-500 mb-1 font-medium">Selisih (+/-)</label>
              <div
                class="font-mono font-bold text-sm"
                :class="diffQty < 0 ? 'text-rose-700' : 'text-emerald-700'"
              >
                {{ diffQty > 0 ? `+${diffQty}` : diffQty }}
              </div>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alasan Penyesuaian</label>
            <input
              v-model="adjForm.reason"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              placeholder="Contoh: Tutup leher galon bocor, opname fisik rutin..."
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Petugas & Otorisasi</label>
            <input
              v-model="adjForm.adjustedBy"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
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
              <span>Simpan Penyesuaian</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Penyesuaian Stok"
      :message="`Apakah Anda yakin ingin menghapus catatan penyesuaian '${adjToDelete?.adjustmentNumber}' (${adjToDelete?.productName})?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
