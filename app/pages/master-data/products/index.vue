<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import type { Product } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Package, Plus, Filter, Edit, Trash2, X, Check } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah, formatNumber } = useCurrency()

const searchQuery = ref('')
const selectedCategory = ref('ALL')

const categories = ['ALL', 'Air Galon', 'Air Botol', 'Kemasan & Wadah']

const filteredProducts = computed(() => {
  return erpStore.products.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat =
      selectedCategory.value === 'ALL' || p.category === selectedCategory.value
    return matchQuery && matchCat
  })
})

// CRUD State
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const formData = reactive({
  sku: '',
  name: '',
  category: 'Air Galon' as 'Air Galon' | 'Air Botol' | 'Kemasan & Wadah',
  unit: 'Galon',
  purchasePrice: 16000,
  sellingPrice: 20000,
  minStock: 100,
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  description: ''
})

// Delete state
const isDeleteOpen = ref(false)
const productToDelete = ref<Product | null>(null)

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.sku = `AQ-NEW-${String(erpStore.products.length + 1).padStart(3, '0')}`
  formData.name = ''
  formData.category = 'Air Galon'
  formData.unit = 'Galon'
  formData.purchasePrice = 16000
  formData.sellingPrice = 20000
  formData.minStock = 100
  formData.status = 'ACTIVE'
  formData.description = ''
  isModalOpen.value = true
}

const openEditModal = (prod: Product) => {
  isEditing.value = true
  editingId.value = prod.id
  formData.sku = prod.sku
  formData.name = prod.name
  formData.category = prod.category
  formData.unit = prod.unit
  formData.purchasePrice = prod.purchasePrice
  formData.sellingPrice = prod.sellingPrice
  formData.minStock = prod.minStock
  formData.status = prod.status
  formData.description = prod.description || ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveProduct = () => {
  if (!formData.name || !formData.sku) return

  if (isEditing.value && editingId.value) {
    erpStore.updateProduct(editingId.value, { ...formData })
  } else {
    erpStore.addProduct({ ...formData })
  }
  isModalOpen.value = false
}

const promptDelete = (prod: Product) => {
  productToDelete.value = prod
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    erpStore.deleteProduct(productToDelete.value.id)
  }
  isDeleteOpen.value = false
  productToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Master Produk & Kemasan Galon"
      subtitle="Katalog resmi varian air minum dalam kemasan Aqua dan inventaris wadah galon polikarbonat."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Produk</span>
        </button>
      </template>
    </PageHeader>

    <!-- Search & Filter Bar -->
    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari nama produk atau kode SKU..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <Filter class="w-3.5 h-3.5 text-slate-400" />
          <span class="text-slate-500 font-medium">Kategori:</span>
          <select
            v-model="selectedCategory"
            class="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat === 'ALL' ? 'Semua Kategori' : cat }}
            </option>
          </select>
        </div>
      </template>
    </SearchFilterBar>

    <!-- Product Table -->
    <div class="bg-white border border-[#EAF0F5] rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-[#EAF0F5] uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">SKU</th>
              <th class="py-2.5 px-3">Nama Produk</th>
              <th class="py-2.5 px-3">Kategori</th>
              <th class="py-2.5 px-3">Satuan</th>
              <th class="py-2.5 px-3 text-right">Harga Beli</th>
              <th class="py-2.5 px-3 text-right">Harga Jual</th>
              <th class="py-2.5 px-3 text-right">Min Stok</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ prod.sku }}
              </td>
              <td class="py-2.5 px-3">
                <div class="font-semibold text-slate-800">{{ prod.name }}</div>
                <div class="text-[11px] text-slate-500 max-w-sm">{{ prod.description }}</div>
              </td>
              <td class="py-2.5 px-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#1D2024]">
                  {{ prod.category }}
                </span>
              </td>
              <td class="py-2.5 px-3 text-slate-600 font-medium">
                {{ prod.unit }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-[#1D2024]">
                {{ formatRupiah(prod.purchasePrice) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-[#1D2024]">
                {{ formatRupiah(prod.sellingPrice) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono text-slate-600">
                {{ formatNumber(prod.minStock) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="prod.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Ubah / Edit Produk"
                    @click="openEditModal(prod)"
                  >
                    <Edit class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-slate-400 hover:text-[#AA0808] hover:bg-[#FFF0EF] rounded transition-colors"
                    title="Hapus Produk"
                    @click="promptDelete(prod)"
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
        v-if="filteredProducts.length === 0"
        title="Tidak ada produk ditemukan"
        description="Silakan sesuaikan kata kunci pencarian atau filter kategori Anda."
      />
    </div>

    <!-- Product Form Modal (Add / Edit) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-[#EAF0F5] shadow-lg max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Package class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">
              {{ isEditing ? 'Edit Data Produk' : 'Tambah Produk Baru' }}
            </h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="closeModal">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveProduct">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Kode SKU</label>
              <input
                v-model="formData.sku"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A6ED1]"
                placeholder="AQ-GALON-19L"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Kategori</label>
              <select
                v-model="formData.category"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              >
                <option value="Air Galon">Air Galon</option>
                <option value="Air Botol">Air Botol</option>
                <option value="Kemasan & Wadah">Kemasan & Wadah</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#1D2024] mb-1">Nama Produk Lengkap</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A6ED1]"
              placeholder="Contoh: Aqua Galon 19 Liter"
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Satuan</label>
              <input
                v-model="formData.unit"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
                placeholder="Galon / Karton"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Harga Beli (Rp)</label>
              <input
                v-model.number="formData.purchasePrice"
                type="number"
                min="0"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Harga Jual (Rp)</label>
              <input
                v-model.number="formData.sellingPrice"
                type="number"
                min="0"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Batas Minimum Stok</label>
              <input
                v-model.number="formData.minStock"
                type="number"
                min="0"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Status Produk</label>
              <select
                v-model="formData.status"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              >
                <option value="ACTIVE">ACTIVE (Aktif)</option>
                <option value="INACTIVE">INACTIVE (Tidak Aktif)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#1D2024] mb-1">Keterangan / Spesifikasi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              placeholder="Spesifikasi kemasan, segel, dan peruntukan..."
            />
          </div>

          <div class="pt-3 border-t border-[#EAF0F5] flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-slate-300 rounded text-[#1D2024] hover:bg-slate-50"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>{{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Produk"
      :message="`Apakah Anda yakin ingin menghapus produk '${productToDelete?.name}' (${productToDelete?.sku})? Data persediaan produk ini juga akan disesuaikan.`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
