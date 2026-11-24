<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import type { GoodsReceipt } from '~~/shared/types'
import { Plus, RotateCcw, X } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatNumber } = useCurrency()

const searchQuery = ref('')
const isModalOpen = ref(false)
const modalMode = ref<'receipt' | 'return'>('receipt')
const receiptForm = reactive({
  poNumber: '', receiptDate: new Date().toISOString().split('T')[0], receivedBy: 'Petugas Gudang', notes: '', items: [] as { productId: string; qty: number; condition: 'Baik' | 'Rusak/Cacat' }[]
})
const returnForm = reactive({
  grNumber: '', returnDate: new Date().toISOString().split('T')[0], returnedBy: 'Petugas Gudang', reason: '', items: [] as { productId: string; qty: number }[]
})

const openReceipt = () => {
  modalMode.value = 'receipt'
  receiptForm.poNumber = erpStore.filteredPurchaseOrders.find((po) => po.status !== 'Selesai' && po.status !== 'Dibatalkan')?.poNumber || ''
  receiptForm.receiptDate = new Date().toISOString().split('T')[0]
  receiptForm.receivedBy = 'Petugas Gudang'
  receiptForm.notes = ''
  isModalOpen.value = true
}

const openReturn = () => {
  modalMode.value = 'return'
  returnForm.grNumber = erpStore.filteredGoodsReceipts[0]?.grNumber || ''
  returnForm.returnDate = new Date().toISOString().split('T')[0]
  returnForm.returnedBy = 'Petugas Gudang'
  returnForm.reason = ''
  isModalOpen.value = true
}

const selectedPO = computed(() => erpStore.purchaseOrders.find((po) => po.poNumber === receiptForm.poNumber))
const selectedGR = computed(() => erpStore.filteredGoodsReceipts.find((gr) => gr.grNumber === returnForm.grNumber))

watch(selectedPO, (po) => {
  receiptForm.items = po?.items.filter((item) => item.qtyReceived < item.qtyOrdered).map((item) => ({ productId: item.productId, qty: item.qtyOrdered - item.qtyReceived, condition: 'Baik' })) || []
}, { immediate: true })

watch(selectedGR, (gr) => {
  returnForm.items = gr?.items.map((item) => ({ productId: item.productId, qty: 0 })) || []
}, { immediate: true })

const saveReceipt = () => {
  const po = selectedPO.value
  if (!po || receiptForm.items.length === 0 || receiptForm.items.every((item) => Number(item.qty) <= 0)) return
  erpStore.addGoodsReceipt({
    poNumber: po.poNumber, supplierId: po.supplierId, supplierName: po.supplierName, depotId: po.depotId, depotName: po.depotName,
    receiptDate: receiptForm.receiptDate, receivedBy: receiptForm.receivedBy, notes: receiptForm.notes,
    status: receiptForm.items.some((item) => item.condition === 'Rusak/Cacat') || receiptForm.items.some((item) => Number(item.qty) < ((po.items.find((poItem) => poItem.productId === item.productId)?.qtyOrdered || 0) - (po.items.find((poItem) => poItem.productId === item.productId)?.qtyReceived || 0))) ? 'Diterima Sebagian' : 'Diterima Penuh',
    items: receiptForm.items.filter((item) => Number(item.qty) > 0).map((item) => {
      const product = erpStore.products.find((product) => product.id === item.productId)!
      return { productId: product.id, productName: product.name, sku: product.sku, unit: product.unit, qtyReceived: Number(item.qty), condition: item.condition }
    })
  })
  isModalOpen.value = false
}

const saveReturn = () => {
  const gr = selectedGR.value
  if (!gr || !returnForm.reason || returnForm.items.every((item) => Number(item.qty) <= 0)) return
  erpStore.addGoodsReturn({
    grNumber: gr.grNumber, poNumber: gr.poNumber, supplierId: gr.supplierId, supplierName: gr.supplierName, depotId: gr.depotId, depotName: gr.depotName,
    returnDate: returnForm.returnDate, returnedBy: returnForm.returnedBy, reason: returnForm.reason, status: 'Selesai',
    items: returnForm.items.filter((item) => Number(item.qty) > 0).map((item) => {
      const product = erpStore.products.find((product) => product.id === item.productId)!
      const received = gr.items.find((grItem) => grItem.productId === item.productId)
      return { productId: product.id, productName: product.name, sku: product.sku, unit: product.unit, qtyReturned: Math.min(Number(item.qty), received?.qtyReceived || 0) }
    })
  })
  isModalOpen.value = false
}

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
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openReturn"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Retur Barang</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openReceipt"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Penerimaan</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor GR, referensi PO, atau nama penerima..."
    />

    <div class="fiori-table-wrap">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead>
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
              class="transition-colors"
            >
              <td class="py-2.5 px-3 font-semibold text-[var(--color-accent)]">
                {{ gr.grNumber }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-[var(--color-text-primary)]">
                <NuxtLink to="/purchasing/purchase-orders" class="fiori-link">
                  {{ gr.poNumber }}
                </NuxtLink>
              </td>
              <td class="py-2.5 px-3 font-medium text-[var(--color-text-primary)]">
                {{ gr.supplierName }}
              </td>
              <td class="py-2.5 px-3 text-[var(--color-text-secondary)]">
                {{ gr.depotName }}
              </td>
              <td class="py-2.5 px-3 text-[var(--color-text-secondary)]">
                {{ formatDate(gr.receiptDate) }}
              </td>
              <td class="py-2.5 px-3 text-[var(--color-text-primary)]">
                {{ gr.receivedBy }}
              </td>
              <td class="py-2.5 px-3">
                <div class="space-y-0.5">
                  <div
                    v-for="item in gr.items"
                    :key="item.productId"
                    class="flex items-center gap-2 text-xs"
                  >
                    <span class="font-medium text-[var(--color-text-primary)]">{{ item.productName }}:</span>
                    <span class="font-bold text-[var(--color-success)] bg-[var(--color-success-bg)] border border-[#86CFAC] px-1.5 py-0.5 rounded-sm">
                      +{{ formatNumber(item.qtyReceived) }}
                    </span>
                    <span class="text-[var(--color-text-tertiary)]">({{ item.condition }})</span>
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

    <div v-if="erpStore.filteredGoodsReturns.length" class="fiori-table-wrap">
      <div class="fiori-panel-header">
        <div>
          <h2 class="fiori-section-title">Retur Barang Terintegrasi</h2>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Retur mengurangi stok dan tercatat di kartu stok.</p>
        </div>
      </div>
      <div class="fiori-table-scroll">
        <table>
          <thead><tr><th>No. Retur</th><th>Ref. GR</th><th>Depot</th><th>Tanggal</th><th>Barang</th><th>Alasan</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="item in erpStore.filteredGoodsReturns" :key="item.id">
              <td class="font-semibold text-[var(--color-accent)]">{{ item.returnNumber }}</td>
              <td>{{ item.grNumber }}</td>
              <td>{{ item.depotName }}</td>
              <td>{{ formatDate(item.returnDate) }}</td>
              <td>{{ item.items.map((line) => `${line.productName} (${formatNumber(line.qtyReturned)})`).join(', ') }}</td>
              <td>{{ item.reason }}</td>
              <td><StatusBadge :status="item.status" size="sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 fiori-modal-backdrop">
      <div class="fiori-panel fiori-dialog w-full max-w-2xl overflow-hidden">
        <div class="fiori-dialog-header">
          <h2 class="text-sm font-bold text-white">{{ modalMode === 'receipt' ? 'Tambah Penerimaan Barang' : 'Buat Retur Barang' }}</h2>
          <button type="button" class="text-[var(--color-shell-text)] hover:text-white" @click="isModalOpen = false"><X class="w-4 h-4" /></button>
        </div>

        <form v-if="modalMode === 'receipt'" class="p-4 space-y-3 text-sm" @submit.prevent="saveReceipt">
          <div class="grid grid-cols-2 gap-3">
            <label class="fiori-label">Purchase Order
              <select v-model="receiptForm.poNumber" class="fiori-input mt-1" required>
                <option value="" disabled>Pilih PO</option>
                <option v-for="po in erpStore.filteredPurchaseOrders.filter((item) => item.status !== 'Selesai' && item.status !== 'Dibatalkan')" :key="po.id" :value="po.poNumber">{{ po.poNumber }} · {{ po.supplierName }}</option>
              </select>
            </label>
            <label class="fiori-label">Tanggal penerimaan
              <input v-model="receiptForm.receiptDate" type="date" class="fiori-input mt-1" required />
            </label>
          </div>
          <label class="fiori-label">Petugas gudang
            <input v-model="receiptForm.receivedBy" class="fiori-input mt-1" required />
          </label>
          <div class="fiori-table-wrap">
            <table><thead><tr><th>Produk</th><th>Outstanding</th><th>Qty diterima</th><th>Kondisi</th></tr></thead>
              <tbody><tr v-for="line in receiptForm.items" :key="line.productId"><td>{{ erpStore.products.find((p) => p.id === line.productId)?.name }}</td><td>{{ line.qty }}</td><td><input v-model.number="line.qty" type="number" min="0" class="fiori-input" /></td><td><select v-model="line.condition" class="fiori-input"><option>Baik</option><option>Rusak/Cacat</option></select></td></tr></tbody>
            </table>
          </div>
          <textarea v-model="receiptForm.notes" class="fiori-input" rows="2" placeholder="Catatan pemeriksaan" />
          <div class="flex justify-end gap-2"><button type="button" class="btn-secondary" @click="isModalOpen = false">Batal</button><button type="submit" class="btn-primary">Simpan Penerimaan</button></div>
        </form>

        <form v-else class="p-4 space-y-3 text-sm" @submit.prevent="saveReturn">
          <div class="grid grid-cols-2 gap-3">
            <label class="fiori-label">Referensi GR
              <select v-model="returnForm.grNumber" class="fiori-input mt-1" required><option value="" disabled>Pilih GR</option><option v-for="gr in erpStore.filteredGoodsReceipts" :key="gr.id" :value="gr.grNumber">{{ gr.grNumber }} · {{ gr.supplierName }}</option></select>
            </label>
            <label class="fiori-label">Tanggal retur
              <input v-model="returnForm.returnDate" type="date" class="fiori-input mt-1" required />
            </label>
          </div>
          <label class="fiori-label">Petugas gudang<input v-model="returnForm.returnedBy" class="fiori-input mt-1" required /></label>
          <div class="fiori-table-wrap"><table><thead><tr><th>Produk</th><th>Diterima</th><th>Qty retur</th></tr></thead><tbody><tr v-for="line in returnForm.items" :key="line.productId"><td>{{ erpStore.products.find((p) => p.id === line.productId)?.name }}</td><td>{{ selectedGR?.items.find((item) => item.productId === line.productId)?.qtyReceived }}</td><td><input v-model.number="line.qty" type="number" min="0" :max="selectedGR?.items.find((item) => item.productId === line.productId)?.qtyReceived" class="fiori-input" /></td></tr></tbody></table></div>
          <label class="fiori-label">Alasan retur<textarea v-model="returnForm.reason" class="fiori-input mt-1" rows="2" required placeholder="Contoh: kemasan rusak saat pemeriksaan" /></label>
          <div class="flex justify-end gap-2"><button type="button" class="btn-secondary" @click="isModalOpen = false">Batal</button><button type="submit" class="btn-primary">Simpan Retur</button></div>
        </form>
      </div>
    </div>
  </div>
</template>
