<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import { useDate } from '~/composables/useDate'
import type { SalesOrder, SOStatus } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Plus, Eye, Edit, Trash2, X, Check, Truck, FileText } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()
const { formatDate } = useDate()

const searchQuery = ref('')
const selectedStatus = ref('ALL')
const selectedSO = ref<SalesOrder | null>(null)

const statuses = ['ALL', 'Diproses', 'Terkirim', 'Selesai & Lunas']

const filteredSalesOrders = computed(() => {
  return erpStore.filteredSalesOrders.filter((so) => {
    const matchQuery =
      so.soNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      so.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      so.paymentType.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus =
      selectedStatus.value === 'ALL' || so.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const openDetail = (so: SalesOrder) => {
  selectedSO.value = so
}

const closeDetail = () => {
  selectedSO.value = null
}

// Add SO Modal State
const isAddModalOpen = ref(false)
const soForm = reactive({
  customerId: '',
  depotId: 'DEP-001',
  orderDate: new Date().toISOString().split('T')[0],
  deliveryDate: new Date().toISOString().split('T')[0],
  paymentType: 'Kredit (TOP 30)' as any,
  status: 'Terkirim' as SOStatus,
  notes: 'Order pasokan rutin pelanggan.',
  items: [
    {
      productId: 'PROD-001',
      qty: 200
    }
  ]
})

const openAddSOModal = () => {
  soForm.customerId = erpStore.customers[0]?.id || ''
  soForm.depotId = erpStore.activeDepotId === 'ALL' ? 'DEP-001' : erpStore.activeDepotId
  soForm.orderDate = new Date().toISOString().split('T')[0]
  soForm.deliveryDate = new Date().toISOString().split('T')[0]
  soForm.paymentType = 'Kredit (TOP 30)'
  soForm.status = 'Terkirim'
  soForm.notes = 'Order pengiriman armada depot.'
  soForm.items = [
    {
      productId: erpStore.products[0]?.id || 'PROD-001',
      qty: 150
    }
  ]
  isAddModalOpen.value = true
}

const addItemRow = () => {
  soForm.items.push({
    productId: erpStore.products[0]?.id || 'PROD-001',
    qty: 20
  })
}

const removeItemRow = (idx: number) => {
  if (soForm.items.length > 1) {
    soForm.items.splice(idx, 1)
  }
}

const calculateTotal = computed(() => {
  return soForm.items.reduce((acc, row) => {
    const prod = erpStore.products.find((p) => p.id === row.productId)
    const price = prod ? prod.sellingPrice : 0
    return acc + (row.qty * price)
  }, 0)
})

const saveSO = () => {
  const cust = erpStore.customers.find((c) => c.id === soForm.customerId)
  const depotName = soForm.depotId === 'DEP-001' ? 'Depot Denpasar' : 'Depot Jimbaran'

  const soItems = soForm.items.map((row) => {
    const prod = erpStore.products.find((p) => p.id === row.productId)!
    return {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      unit: prod.unit,
      qty: Number(row.qty),
      unitPrice: prod.sellingPrice,
      subtotal: Number(row.qty) * prod.sellingPrice
    }
  })

  erpStore.addSalesOrder({
    customerId: cust?.id || 'CUST-001',
    customerName: cust?.name || 'Pelanggan',
    customerType: cust?.type || 'Corporate',
    depotId: soForm.depotId,
    depotName: depotName,
    orderDate: soForm.orderDate,
    deliveryDate: soForm.deliveryDate,
    paymentType: soForm.paymentType,
    items: soItems,
    totalAmount: calculateTotal.value,
    status: soForm.status,
    notes: soForm.notes
  })

  isAddModalOpen.value = false
}

// Delete State
const isDeleteOpen = ref(false)
const soToDelete = ref<SalesOrder | null>(null)

const promptDeleteSO = (so: SalesOrder) => {
  soToDelete.value = so
  isDeleteOpen.value = true
}

const confirmDeleteSO = () => {
  if (soToDelete.value) {
    erpStore.deleteSalesOrder(soToDelete.value.id)
  }
  isDeleteOpen.value = false
  soToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Pesanan Penjualan (Sales Orders)"
      subtitle="Pencatatan order distribusi Aqua ke hotel, restoran, grosir, dan langganan rumah tangga."
      show-depot-tag
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddSOModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Buat SO Baru</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nomor SO, nama pelanggan, atau tipe pembayaran..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-slate-500 font-medium">Status:</span>
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
              <th class="py-2.5 px-3">No. SO</th>
              <th class="py-2.5 px-3">Pelanggan</th>
              <th class="py-2.5 px-3">Tipe</th>
              <th class="py-2.5 px-3">Depot Asal</th>
              <th class="py-2.5 px-3">Tgl Order</th>
              <th class="py-2.5 px-3">Termin Bayar</th>
              <th class="py-2.5 px-3 text-right">Total Nilai</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="so in filteredSalesOrders"
              :key="so.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ so.soNumber }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ so.customerName }}
              </td>
              <td class="py-2.5 px-3">
                <StatusBadge :status="so.customerType" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ so.depotName }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ formatDate(so.orderDate) }}
              </td>
              <td class="py-2.5 px-3 text-slate-700 font-medium">
                {{ so.paymentType }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatRupiah(so.totalAmount) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="so.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Lihat Detail SO"
                    @click="openDetail(so)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Batalkan / Hapus SO"
                    @click="promptDeleteSO(so)"
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
        v-if="filteredSalesOrders.length === 0"
        title="Tidak ada pesanan penjualan ditemukan"
      />
    </div>

    <!-- SO Detail Modal -->
    <div
      v-if="selectedSO"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Truck class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Rincian Dokumen Penjualan: {{ selectedSO.soNumber }}</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="closeDetail">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span class="text-slate-500 block">Pelanggan:</span>
              <span class="font-semibold text-slate-800">{{ selectedSO.customerName }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Depot Distribusi:</span>
              <span class="font-semibold text-slate-800">{{ selectedSO.depotName }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Termin Pembayaran:</span>
              <span class="font-semibold text-slate-800">{{ selectedSO.paymentType }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Status Dokumen:</span>
              <StatusBadge :status="selectedSO.status" size="sm" />
            </div>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider">Item Produk yang Dipesan</h4>
            <table class="w-full border border-slate-200 rounded text-left">
              <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th class="py-2 px-3">Produk</th>
                  <th class="py-2 px-3 text-right">Kuantitas</th>
                  <th class="py-2 px-3 text-right">Harga Jual Satuan</th>
                  <th class="py-2 px-3 text-right">Total Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in selectedSO.items" :key="item.productId">
                  <td class="py-2 px-3">
                    <div class="font-semibold text-slate-800">{{ item.productName }}</div>
                    <div class="text-[10px] font-mono text-slate-500">{{ item.sku }}</div>
                  </td>
                  <td class="py-2 px-3 text-right font-mono font-bold text-blue-900">
                    {{ formatNumber(item.qty) }} {{ item.unit }}
                  </td>
                  <td class="py-2 px-3 text-right font-mono">
                    {{ formatRupiah(item.unitPrice) }}
                  </td>
                  <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {{ formatRupiah(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-slate-50 border-t border-slate-200 font-bold">
                <tr>
                  <td colspan="3" class="py-2 px-3 text-right uppercase text-[10px] tracking-wider">
                    Total Penjualan:
                  </td>
                  <td class="py-2 px-3 text-right font-mono text-sm text-[#0f3b6c]">
                    {{ formatRupiah(selectedSO.totalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div v-if="selectedSO.notes" class="p-2.5 bg-blue-50/50 rounded border border-blue-100 text-slate-600">
            <span class="font-semibold block text-[10px] text-blue-900 uppercase">Catatan Order / Distribusi:</span>
            {{ selectedSO.notes }}
          </div>
        </div>

        <div class="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-end">
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

    <!-- Create SO Form Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Truck class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Buat Pesanan Penjualan Baru (Sales Order)</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isAddModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 overflow-y-auto space-y-3.5 text-xs" @submit.prevent="saveSO">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Pilih Mitra Pelanggan</label>
              <select
                v-model="soForm.customerId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option v-for="c in erpStore.customers" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.type }})
                </option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Depot Pengiriman</label>
              <select
                v-model="soForm.depotId"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option value="DEP-001">Depot Denpasar (DPS)</option>
                <option value="DEP-002">Depot Jimbaran (JBR)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Pesanan</label>
              <input
                v-model="soForm.orderDate"
                type="date"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Metode & Termin Pembayaran</label>
              <select
                v-model="soForm.paymentType"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option value="Tunai">Tunai Langsung</option>
                <option value="Tunai (COD)">Tunai COD di Lokasi</option>
                <option value="Kredit (TOP 14)">Kredit (TOP 14 Hari)</option>
                <option value="Kredit (TOP 21)">Kredit (TOP 21 Hari)</option>
                <option value="Kredit (TOP 30)">Kredit (TOP 30 Hari)</option>
              </select>
            </div>
          </div>

          <!-- Items Row -->
          <div class="border border-slate-200 rounded p-3 bg-slate-50/50">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold uppercase tracking-wider text-[11px] text-slate-700">Daftar Produk yang Dipesan</span>
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
                v-for="(row, idx) in soForm.items"
                :key="idx"
                class="flex items-center gap-2 bg-white p-2 rounded border border-slate-200"
              >
                <div class="flex-1">
                  <select
                    v-model="row.productId"
                    class="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:bg-white text-xs"
                  >
                    <option v-for="p in erpStore.products" :key="p.id" :value="p.id">
                      {{ p.name }} (Harga Jual: {{ formatRupiah(p.sellingPrice) }})
                    </option>
                  </select>
                </div>
                <div class="w-28">
                  <input
                    v-model.number="row.qty"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    class="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-xs"
                  />
                </div>
                <button
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-600"
                  :disabled="soForm.items.length === 1"
                  @click="removeItemRow(idx)"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
              <span>Total Tagihan Penjualan (SO):</span>
              <span class="font-mono text-sm text-[#0f3b6c]">{{ formatRupiah(calculateTotal) }}</span>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Pengiriman</label>
            <input
              v-model="soForm.notes"
              type="text"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              placeholder="Waktu kirim yang diinginkan, kontak penerima..."
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
              <span>Simpan & Terbitkan SO</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete SO Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Batalkan / Hapus Pesanan Penjualan"
      :message="`Apakah Anda yakin ingin menghapus order '${soToDelete?.soNumber}' (${soToDelete?.customerName}) senilai ${formatRupiah(soToDelete?.totalAmount)}?`"
      @confirm="confirmDeleteSO"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
