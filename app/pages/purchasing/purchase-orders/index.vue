<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import { useDate } from '~/composables/useDate'
import type { PurchaseOrder, POStatus } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Plus, Eye, Edit, Trash2, X, Check, ShoppingBag, FileText } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()
const { formatDate } = useDate()

const searchQuery = ref('')
const selectedStatus = ref('ALL')
const selectedPO = ref<PurchaseOrder | null>(null)

const statuses = ['ALL', 'Disetujui', 'Sebagian Diterima', 'Selesai']

const filteredOrders = computed(() => {
  return erpStore.filteredPurchaseOrders.filter((po) => {
    const matchQuery =
      po.poNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      po.depotName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus =
      selectedStatus.value === 'ALL' || po.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const openDetail = (po: PurchaseOrder) => {
  selectedPO.value = po
}

const closeDetail = () => {
  selectedPO.value = null
}

// CRUD State: Add PO
const isAddModalOpen = ref(false)
const poForm = reactive({
  supplierId: '',
  depotId: 'DEP-001',
  orderDate: new Date().toISOString().split('T')[0],
  expectedDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
  status: 'Disetujui' as POStatus,
  notes: '',
  items: [
    {
      productId: 'PROD-001',
      qtyOrdered: 400
    }
  ]
})

const openAddPOModal = () => {
  poForm.supplierId = erpStore.suppliers[0]?.id || ''
  poForm.depotId = erpStore.activeDepotId === 'ALL' ? 'DEP-001' : erpStore.activeDepotId
  poForm.orderDate = new Date().toISOString().split('T')[0]
  poForm.expectedDate = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0]
  poForm.status = 'Disetujui'
  poForm.notes = 'Pengadaan rutin pabrik Danone Mambal.'
  poForm.items = [
    {
      productId: erpStore.products[0]?.id || 'PROD-001',
      qtyOrdered: 300
    }
  ]
  isAddModalOpen.value = true
}

const addItemRow = () => {
  poForm.items.push({
    productId: erpStore.products[0]?.id || 'PROD-001',
    qtyOrdered: 100
  })
}

const removeItemRow = (idx: number) => {
  if (poForm.items.length > 1) {
    poForm.items.splice(idx, 1)
  }
}

const calculateTotal = computed(() => {
  return poForm.items.reduce((acc, row) => {
    const prod = erpStore.products.find((p) => p.id === row.productId)
    const price = prod ? prod.purchasePrice : 0
    return acc + (row.qtyOrdered * price)
  }, 0)
})

const savePO = () => {
  const supplier = erpStore.suppliers.find((s) => s.id === poForm.supplierId)
  const depotName = poForm.depotId === 'DEP-001' ? 'Depot Denpasar' : 'Depot Jimbaran'

  const poItems = poForm.items.map((row) => {
    const prod = erpStore.products.find((p) => p.id === row.productId)!
    return {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      unit: prod.unit,
      qtyOrdered: Number(row.qtyOrdered),
      qtyReceived: 0,
      unitPrice: prod.purchasePrice,
      subtotal: Number(row.qtyOrdered) * prod.purchasePrice
    }
  })

  erpStore.addPurchaseOrder({
    supplierId: supplier?.id || 'SUP-001',
    supplierName: supplier?.name || 'PT Tirta Investama Danone Mambal',
    depotId: poForm.depotId,
    depotName: depotName,
    orderDate: poForm.orderDate,
    expectedDate: poForm.expectedDate,
    items: poItems,
    totalAmount: calculateTotal.value,
    status: poForm.status,
    notes: poForm.notes
  })

  isAddModalOpen.value = false
}

// Delete PO State
const isDeleteOpen = ref(false)
const poToDelete = ref<PurchaseOrder | null>(null)

const promptDeletePO = (po: PurchaseOrder) => {
  poToDelete.value = po
  isDeleteOpen.value = true
}

const confirmDeletePO = () => {
  if (poToDelete.value) {
    erpStore.deletePurchaseOrder(poToDelete.value.id)
  }
  isDeleteOpen.value = false
  poToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Pesanan Pembelian (Purchase Orders)"
      subtitle="Pengadaan stok air minum dalam kemasan Aqua dan wadah galon dari pabrik Danone."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A6ED1] hover:bg-[#0854A0] text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddPOModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Buat PO Baru</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor PO, nama pabrik/pemasok..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-[#425B73] font-medium">Status:</span>
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
              <th class="py-2.5 px-3">No. PO</th>
              <th class="py-2.5 px-3">Pemasok / Pabrik</th>
              <th class="py-2.5 px-3">Depot Tujuan</th>
              <th class="py-2.5 px-3">Tgl Pemesanan</th>
              <th class="py-2.5 px-3">Estimasi Tiba</th>
              <th class="py-2.5 px-3 text-right">Total Nilai</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="po in filteredOrders"
              :key="po.id"
              class="hover:bg-[#F5F7FA] transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ po.poNumber }}
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-800">
                {{ po.supplierName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ po.depotName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(po.orderDate) }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(po.expectedDate) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-[#1D2024]">
                {{ formatRupiah(po.totalAmount) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="po.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Lihat Detail Item PO"
                    @click="openDetail(po)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-[#647B91] hover:text-[#AA0808] hover:bg-[#FFF0EF] rounded transition-colors"
                    title="Batalkan / Hapus PO"
                    @click="promptDeletePO(po)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-if="filteredOrders.length === 0"
        title="Tidak ada pesanan pembelian ditemukan"
      />
    </div>

    <!-- PO Detail Modal -->
    <div
      v-if="selectedPO"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded border border-[#EAF0F5] shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Rincian Dokumen: {{ selectedPO.poNumber }}</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="closeDetail">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3 p-3 bg-[#F5F7FA] rounded border border-[#EAF0F5]">
            <div>
              <span class="text-[#425B73] block">Pemasok:</span>
              <span class="font-semibold text-slate-800">{{ selectedPO.supplierName }}</span>
            </div>
            <div>
              <span class="text-[#425B73] block">Depot Penerima:</span>
              <span class="font-semibold text-slate-800">{{ selectedPO.depotName }}</span>
            </div>
            <div>
              <span class="text-[#425B73] block">Tanggal Order:</span>
              <span class="font-mono text-slate-800">{{ formatDate(selectedPO.orderDate) }}</span>
            </div>
            <div>
              <span class="text-[#425B73] block">Status:</span>
              <StatusBadge :status="selectedPO.status" size="sm" />
            </div>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider">Daftar Barang Dipesan</h4>
            <table class="w-full border border-[#EAF0F5] rounded text-left">
              <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-[#EAF0F5]">
                <tr>
                  <th class="py-2 px-3">Produk</th>
                  <th class="py-2 px-3 text-right">Qty Pesan</th>
                  <th class="py-2 px-3 text-right">Qty Diterima</th>
                  <th class="py-2 px-3 text-right">Harga Satuan</th>
                  <th class="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in selectedPO.items" :key="item.productId">
                  <td class="py-2 px-3">
                    <div class="font-semibold text-slate-800">{{ item.productName }}</div>
                    <div class="text-[10px] font-mono text-[#425B73]">{{ item.sku }}</div>
                  </td>
                  <td class="py-2 px-3 text-right font-mono font-medium">
                    {{ formatNumber(item.qtyOrdered) }} {{ item.unit }}
                  </td>
                  <td class="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">
                    {{ formatNumber(item.qtyReceived) }}
                  </td>
                  <td class="py-2 px-3 text-right font-mono">
                    {{ formatRupiah(item.unitPrice) }}
                  </td>
                  <td class="py-2 px-3 text-right font-mono font-bold text-[#1D2024]">
                    {{ formatRupiah(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-[#F5F7FA] border-t border-[#EAF0F5] font-bold">
                <tr>
                  <td colspan="4" class="py-2 px-3 text-right uppercase text-[10px] tracking-wider">
                    Total Pesanan (IDR):
                  </td>
                  <td class="py-2 px-3 text-right font-mono text-sm text-[#0f3b6c]">
                    {{ formatRupiah(selectedPO.totalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div v-if="selectedPO.notes" class="p-2.5 bg-blue-50/50 rounded border border-blue-100 text-slate-600">
            <span class="font-semibold block text-[10px] text-blue-900 uppercase">Catatan PO:</span>
            {{ selectedPO.notes }}
          </div>
        </div>

        <div class="px-4 py-2.5 bg-slate-100 border-t border-[#EAF0F5] flex justify-end">
          <button
            type="button"
            class="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold"
            @click="closeDetail"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Create PO Form Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-[#EAF0F5] shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingBag class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Buat Pesanan Pembelian Baru (PO)</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isAddModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 overflow-y-auto space-y-3.5 text-xs" @submit.prevent="savePO">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Pilih Pemasok / Produsen</label>
              <select
                v-model="poForm.supplierId"
                required
                class="w-full px-2.5 py-1.5 bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              >
                <option v-for="s in erpStore.suppliers" :key="s.id" :value="s.id">
                  {{ s.name }} ({{ s.supplierCode }})
                </option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Depot Tujuan Penerimaan</label>
              <select
                v-model="poForm.depotId"
                required
                class="w-full px-2.5 py-1.5 bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              >
                <option value="DEP-001">Depot Denpasar (DPS-01)</option>
                <option value="DEP-002">Depot Jimbaran (JBR-01)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Tanggal Pemesanan</label>
              <input
                v-model="poForm.orderDate"
                type="date"
                required
                class="w-full px-2.5 py-1.5 bg-[#F5F7FA] border border-[#D9E2EC] rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Estimasi Tiba di Gudang</label>
              <input
                v-model="poForm.expectedDate"
                type="date"
                required
                class="w-full px-2.5 py-1.5 bg-[#F5F7FA] border border-[#D9E2EC] rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Items Row -->
          <div class="border border-[#EAF0F5] rounded p-3 bg-[#F5F7FA]/50">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold uppercase tracking-wider text-[11px] text-[#1D2024]">Daftar Produk yang Dipesan</span>
              <button
                type="button"
                class="text-blue-700 font-semibold text-xs hover:underline flex items-center gap-1"
                @click="addItemRow"
              >
                <Plus class="w-3.5 h-3.5" /> Tambah Baris
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(row, idx) in poForm.items"
                :key="idx"
                class="flex items-center gap-2 bg-white p-2 rounded border border-[#EAF0F5]"
              >
                <div class="flex-1">
                  <select
                    v-model="row.productId"
                    class="w-full px-2 py-1 bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white text-xs"
                  >
                    <option v-for="p in erpStore.products" :key="p.id" :value="p.id">
                      {{ p.name }} ({{ formatRupiah(p.purchasePrice) }})
                    </option>
                  </select>
                </div>
                <div class="w-28">
                  <input
                    v-model.number="row.qtyOrdered"
                    type="number"
                    min="1"
                    placeholder="Kuantitas"
                    class="w-full px-2 py-1 bg-[#F5F7FA] border border-[#D9E2EC] rounded font-mono text-right text-xs"
                  />
                </div>
                <button
                  type="button"
                  class="p-1 text-[#647B91] hover:text-[#AA0808]"
                  :disabled="poForm.items.length === 1"
                  @click="removeItemRow(idx)"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="mt-3 pt-2 border-t border-[#EAF0F5] flex justify-between items-center text-xs font-bold">
              <span>Total Estimasi Biaya PO:</span>
              <span class="font-mono text-sm text-[#0f3b6c]">{{ formatRupiah(calculateTotal) }}</span>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#1D2024] mb-1">Catatan PO</label>
            <input
              v-model="poForm.notes"
              type="text"
              class="w-full px-2.5 py-1.5 bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              placeholder="Instruksi pengiriman batch pabrik..."
            />
          </div>

          <div class="pt-3 border-t border-[#EAF0F5] flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-[#D9E2EC] rounded text-[#1D2024] hover:bg-[#F5F7FA]"
              @click="isAddModalOpen = false"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0A6ED1] hover:bg-[#0854A0] text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>Simpan & Ajukan PO</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete PO Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Batalkan / Hapus Purchase Order"
      :message="`Apakah Anda yakin ingin membatalkan dokumen '${poToDelete?.poNumber}' senilai ${formatRupiah(poToDelete?.totalAmount)}?`"
      @confirm="confirmDeletePO"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
