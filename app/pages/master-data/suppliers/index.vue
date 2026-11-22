<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import type { Supplier } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Plus, Edit, Trash2, X, Check, Building } from 'lucide-vue-next'

const erpStore = useErpStore()
const searchQuery = ref('')

const filteredSuppliers = computed(() => {
  return erpStore.suppliers.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.supplierCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// CRUD State
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const formData = reactive({
  supplierCode: '',
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  city: 'Badung, Bali',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
})

// Delete State
const isDeleteOpen = ref(false)
const supplierToDelete = ref<Supplier | null>(null)

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.supplierCode = `SPL-${String(erpStore.suppliers.length + 1).padStart(3, '0')}`
  formData.name = ''
  formData.contactPerson = ''
  formData.phone = ''
  formData.email = ''
  formData.address = ''
  formData.city = 'Badung, Bali'
  formData.status = 'ACTIVE'
  isModalOpen.value = true
}

const openEditModal = (sup: Supplier) => {
  isEditing.value = true
  editingId.value = sup.id
  formData.supplierCode = sup.supplierCode
  formData.name = sup.name
  formData.contactPerson = sup.contactPerson
  formData.phone = sup.phone
  formData.email = sup.email || ''
  formData.address = sup.address
  formData.city = sup.city
  formData.status = sup.status
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveSupplier = () => {
  if (!formData.name || !formData.supplierCode) return

  if (isEditing.value && editingId.value) {
    erpStore.updateSupplier(editingId.value, { ...formData })
  } else {
    erpStore.addSupplier({ ...formData })
  }
  isModalOpen.value = false
}

const promptDelete = (sup: Supplier) => {
  supplierToDelete.value = sup
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (supplierToDelete.value) {
    erpStore.deleteSupplier(supplierToDelete.value.id)
  }
  isDeleteOpen.value = false
  supplierToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Master Pemasok (Suppliers)"
      subtitle="Daftar produsen resmi Aqua (Danone Tirta Investama) dan mitra vendor pengadaan wadah galon."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Pemasok</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari kode vendor, nama perusahaan, atau kontak..."
    />

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">Kode</th>
              <th class="py-2.5 px-3">Nama Pemasok / Pabrik</th>
              <th class="py-2.5 px-3">PIC / Kontak Person</th>
              <th class="py-2.5 px-3">Telepon</th>
              <th class="py-2.5 px-3">Email</th>
              <th class="py-2.5 px-3">Alamat Pabrik</th>
              <th class="py-2.5 px-3 text-center">Status</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="sup in filteredSuppliers"
              :key="sup.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ sup.supplierCode }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ sup.name }}
              </td>
              <td class="py-2.5 px-3 text-slate-700 font-medium">
                {{ sup.contactPerson }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-600">
                {{ sup.phone }}
              </td>
              <td class="py-2.5 px-3 text-slate-600">
                {{ sup.email || '-' }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 max-w-sm truncate">
                {{ sup.address }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="sup.status" size="sm" />
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                    title="Ubah / Edit Pemasok"
                    @click="openEditModal(sup)"
                  >
                    <Edit class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Hapus Pemasok"
                    @click="promptDelete(sup)"
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
        v-if="filteredSuppliers.length === 0"
        title="Tidak ada pemasok ditemukan"
      />
    </div>

    <!-- Supplier Form Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Building class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">
              {{ isEditing ? 'Edit Data Pemasok' : 'Tambah Pemasok Baru' }}
            </h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="closeModal">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveSupplier">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Pemasok</label>
              <input
                v-model="formData.supplierCode"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Status</label>
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
            <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan / Produsen</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              placeholder="Contoh: PT Tirta Investama Danone Mambal"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">PIC / Kontak Person</label>
              <input
                v-model="formData.contactPerson"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
                placeholder="Nama penanggung jawab..."
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
              <input
                v-model="formData.phone"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-hidden"
                placeholder="(0361) 461234"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              placeholder="distribution.bali@danone.com"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Pabrik / Gudang</label>
            <textarea
              v-model="formData.address"
              rows="2"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
              placeholder="Jalan, kawasan industri, kota..."
            />
          </div>

          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>{{ isEditing ? 'Simpan Perubahan' : 'Tambah Pemasok' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Pemasok"
      :message="`Apakah Anda yakin ingin menghapus data pemasok '${supplierToDelete?.name}' (${supplierToDelete?.supplierCode})?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
