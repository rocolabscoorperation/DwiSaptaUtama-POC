<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import type { Customer, CustomerType, PaymentTerms } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Users, Plus, Filter, Edit, Trash2, X, Check } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah } = useCurrency()

const searchQuery = ref('')
const selectedType = ref('ALL')

const customerTypes = ['ALL', 'Corporate', 'Reseller', 'Retail']

const filteredCustomers = computed(() => {
  return erpStore.customers.filter((c) => {
    const matchQuery =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType =
      selectedType.value === 'ALL' || c.type === selectedType.value
    return matchQuery && matchType
  })
})

// CRUD State
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const formData = reactive({
  customerCode: '',
  name: '',
  type: 'Corporate' as CustomerType,
  phone: '',
  email: '',
  address: '',
  city: 'Denpasar',
  paymentTerms: 'TOP 30 Hari' as PaymentTerms,
  creditLimit: 15000000,
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
})

// Delete state
const isDeleteOpen = ref(false)
const customerToDelete = ref<Customer | null>(null)

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.customerCode = `CST-${String(erpStore.customers.length + 1).padStart(3, '0')}`
  formData.name = ''
  formData.type = 'Corporate'
  formData.phone = ''
  formData.email = ''
  formData.address = ''
  formData.city = 'Denpasar'
  formData.paymentTerms = 'TOP 30 Hari'
  formData.creditLimit = 15000000
  formData.status = 'ACTIVE'
  isModalOpen.value = true
}

const openEditModal = (cust: Customer) => {
  isEditing.value = true
  editingId.value = cust.id
  formData.customerCode = cust.customerCode
  formData.name = cust.name
  formData.type = cust.type
  formData.phone = cust.phone
  formData.email = cust.email || ''
  formData.address = cust.address
  formData.city = cust.city
  formData.paymentTerms = cust.paymentTerms
  formData.creditLimit = cust.creditLimit
  formData.status = cust.status
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCustomer = () => {
  if (!formData.name || !formData.customerCode) return

  if (isEditing.value && editingId.value) {
    erpStore.updateCustomer(editingId.value, { ...formData })
  } else {
    erpStore.addCustomer({ ...formData })
  }
  isModalOpen.value = false
}

const promptDelete = (cust: Customer) => {
  customerToDelete.value = cust
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (customerToDelete.value) {
    erpStore.deleteCustomer(customerToDelete.value.id)
  }
  isDeleteOpen.value = false
  customerToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Master Pelanggan (Customers)"
      subtitle="Data pelanggan korporat, reseller grosir toko, restoran, dan pelanggan ritel rumah tangga."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A6ED1] hover:bg-[#0854A0] text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Pelanggan</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari kode pelanggan, nama toko/hotel, atau alamat..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <Filter class="w-3.5 h-3.5 text-[#647B91]" />
          <span class="text-[#425B73] font-medium">Tipe Mitra:</span>
          <select
            v-model="selectedType"
            class="px-2 py-1 text-xs bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="t in customerTypes" :key="t" :value="t">
              {{ t === 'ALL' ? 'Semua Tipe' : t }}
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
              <th class="py-2.5 px-3">Kode</th>
              <th class="py-2.5 px-3">Nama Pelanggan</th>
              <th class="py-2.5 px-3">Tipe</th>
              <th class="py-2.5 px-3">Kontak / Telepon</th>
              <th class="py-2.5 px-3">Alamat</th>
              <th class="py-2.5 px-3">Termin Pembayaran</th>
              <th class="py-2.5 px-3 text-right">Plafon Kredit</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="cust in filteredCustomers"
              :key="cust.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ cust.customerCode }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ cust.name }}
              </td>
              <td class="py-2.5 px-3">
                <StatusBadge :status="cust.type" size="sm" />
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-600">
                {{ cust.phone }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                {{ cust.address }}
              </td>
              <td class="py-2.5 px-3 font-medium text-[#1D2024]">
                {{ cust.paymentTerms }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-semibold text-[#1D2024]">
                {{ cust.creditLimit > 0 ? formatRupiah(cust.creditLimit) : '-' }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="cust.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Ubah / Edit Pelanggan"
                    @click="openEditModal(cust)"
                  >
                    <Edit class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-[#647B91] hover:text-[#AA0808] hover:bg-[#FFF0EF] rounded transition-colors"
                    title="Hapus Pelanggan"
                    @click="promptDelete(cust)"
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
        v-if="filteredCustomers.length === 0"
        title="Tidak ada pelanggan ditemukan"
      />
    </div>

    <!-- Customer Form Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-[#EAF0F5] shadow-lg max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">
              {{ isEditing ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru' }}
            </h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="closeModal">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveCustomer">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Kode Pelanggan</label>
              <input
                v-model="formData.customerCode"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Tipe Pelanggan</label>
              <select
                v-model="formData.type"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              >
                <option value="Corporate">Corporate (Hotel/Instansi)</option>
                <option value="Reseller">Reseller (Toko Grosir)</option>
                <option value="Retail">Retail (Rumah Tangga/Resto)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#1D2024] mb-1">Nama Perusahaan / Toko / Pelanggan</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              placeholder="Contoh: PT Bali Sunset Resort & Spa Hotel"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Nomor Telepon</label>
              <input
                v-model="formData.phone"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded font-mono focus:bg-white focus:outline-hidden"
                placeholder="(0361) 754890 / 0812-..."
              />
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Email (Opsional)</label>
              <input
                v-model="formData.email"
                type="email"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
                placeholder="purchasing@mitra.com"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#1D2024] mb-1">Alamat Pengiriman / Lokasi</label>
            <textarea
              v-model="formData.address"
              rows="2"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              placeholder="Jalan, nomor, kelurahan, kecamatan..."
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Termin Pembayaran</label>
              <select
                v-model="formData.paymentTerms"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden"
              >
                <option value="Cash (Tunai)">Cash (Tunai)</option>
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                <option value="TOP 14 Hari">TOP 14 Hari</option>
                <option value="TOP 21 Hari">TOP 21 Hari</option>
                <option value="TOP 30 Hari">TOP 30 Hari</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-[#1D2024] mb-1">Plafon Kredit (Rp)</label>
              <input
                v-model.number="formData.creditLimit"
                type="number"
                min="0"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-[#D9E2EC] rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-[#EAF0F5] flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-[#D9E2EC] rounded text-[#1D2024] hover:bg-slate-50"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0A6ED1] hover:bg-[#0854A0] text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>{{ isEditing ? 'Simpan Perubahan' : 'Tambah Pelanggan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Pelanggan"
      :message="`Apakah Anda yakin ingin menghapus data pelanggan '${customerToDelete?.name}' (${customerToDelete?.customerCode})?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
