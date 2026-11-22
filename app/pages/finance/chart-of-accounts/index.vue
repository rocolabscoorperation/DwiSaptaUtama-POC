<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useCurrency } from '~/composables/useCurrency'
import type { ChartOfAccount, AccountCategory } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import SearchFilterBar from '~/components/shared/SearchFilterBar.vue'
import EmptyState from '~/components/shared/EmptyState.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { Plus, Edit, Trash2, X, Check, Landmark, Filter } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatRupiah } = useCurrency()

const searchQuery = ref('')
const selectedCategory = ref('ALL')

const categories = [
  'ALL',
  'Aset Lancar',
  'Kewajiban Lancar',
  'Ekuitas',
  'Pendapatan',
  'Beban Pokok Penjualan',
  'Beban Operasional'
]

const filteredAccounts = computed(() => {
  return erpStore.chartOfAccounts.filter((acc) => {
    const matchQuery =
      acc.accountCode.includes(searchQuery.value) ||
      acc.accountName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat =
      selectedCategory.value === 'ALL' || acc.category === selectedCategory.value
    return matchQuery && matchCat
  })
})

// CRUD State
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingCode = ref<string | null>(null)

const formData = reactive({
  accountCode: '',
  accountName: '',
  category: 'Aset Lancar' as AccountCategory,
  normalBalance: 'Debit' as 'Debit' | 'Kredit',
  balance: 0,
  description: ''
})

// Delete State
const isDeleteOpen = ref(false)
const accountToDelete = ref<ChartOfAccount | null>(null)

const openAddModal = () => {
  isEditing.value = false
  editingCode.value = null
  formData.accountCode = ''
  formData.accountName = ''
  formData.category = 'Aset Lancar'
  formData.normalBalance = 'Debit'
  formData.balance = 0
  formData.description = ''
  isModalOpen.value = true
}

const openEditModal = (acc: ChartOfAccount) => {
  isEditing.value = true
  editingCode.value = acc.accountCode
  formData.accountCode = acc.accountCode
  formData.accountName = acc.accountName
  formData.category = acc.category
  formData.normalBalance = acc.normalBalance
  formData.balance = acc.balance
  formData.description = acc.description || ''
  isModalOpen.value = true
}

const saveAccount = () => {
  if (!formData.accountCode || !formData.accountName) return

  if (isEditing.value && editingCode.value) {
    erpStore.updateAccount(editingCode.value, { ...formData })
  } else {
    erpStore.addAccount({ ...formData })
  }
  isModalOpen.value = false
}

const promptDelete = (acc: ChartOfAccount) => {
  accountToDelete.value = acc
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (accountToDelete.value) {
    erpStore.deleteAccount(accountToDelete.value.accountCode)
  }
  isDeleteOpen.value = false
  accountToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Bagan Akun Standar (Chart of Accounts)"
      subtitle="Struktur klasifikasi buku besar standar akuntansi usaha distribusi air minum Aqua."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Akun</span>
        </button>
      </template>
    </PageHeader>

    <SearchFilterBar
      v-model="searchQuery"
      placeholder="Cari kode akun atau nama perkiraan..."
    >
      <template #filters>
        <div class="flex items-center gap-1.5 text-xs">
          <Filter class="w-3.5 h-3.5 text-slate-400" />
          <span class="text-slate-500 font-medium">Klasifikasi:</span>
          <select
            v-model="selectedCategory"
            class="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-hidden"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat === 'ALL' ? 'Semua Klasifikasi' : cat }}
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
              <th class="py-2.5 px-3">Kode Akun</th>
              <th class="py-2.5 px-3">Nama Perkiraan / Akun</th>
              <th class="py-2.5 px-3">Kelompok Akun</th>
              <th class="py-2.5 px-3">Saldo Normal</th>
              <th class="py-2.5 px-3 text-right">Saldo Berjalan (IDR)</th>
              <th class="py-2.5 px-3">Deskripsi / Peruntukan</th>
              <th class="py-2.5 px-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="acc in filteredAccounts"
              :key="acc.accountCode"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-bold text-blue-900">
                {{ acc.accountCode }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ acc.accountName }}
              </td>
              <td class="py-2.5 px-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                  {{ acc.category }}
                </span>
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-600">
                {{ acc.normalBalance }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatRupiah(acc.balance) }}
              </td>
              <td class="py-2.5 px-3 text-slate-500 max-w-sm truncate text-[11px]">
                {{ acc.description }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded"
                    title="Ubah Akun"
                    @click="openEditModal(acc)"
                  >
                    <Edit class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Hapus Akun"
                    @click="promptDelete(acc)"
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
        v-if="filteredAccounts.length === 0"
        title="Tidak ada akun COA ditemukan"
      />
    </div>

    <!-- Account Form Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Landmark class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">
              {{ isEditing ? 'Edit Akun COA' : 'Tambah Akun Baru' }}
            </h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3 text-xs" @submit.prevent="saveAccount">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Akun</label>
              <input
                v-model="formData.accountCode"
                type="text"
                required
                :disabled="isEditing"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
                placeholder="1050"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Saldo Normal</label>
              <select
                v-model="formData.normalBalance"
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              >
                <option value="Debit">Debit</option>
                <option value="Kredit">Kredit</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Perkiraan Akun</label>
            <input
              v-model="formData.accountName"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              placeholder="Contoh: Kas Cadangan Operasional"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Kelompok Klasifikasi</label>
            <select
              v-model="formData.category"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
            >
              <option value="Aset Lancar">Aset Lancar</option>
              <option value="Aset Tetap">Aset Tetap</option>
              <option value="Kewajiban Lancar">Kewajiban Lancar</option>
              <option value="Ekuitas">Ekuitas</option>
              <option value="Pendapatan">Pendapatan</option>
              <option value="Beban Pokok Penjualan">Beban Pokok Penjualan</option>
              <option value="Beban Operasional">Beban Operasional</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Saldo Berjalan (Rp)</label>
            <input
              v-model.number="formData.balance"
              type="number"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi / Peruntukan</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
            />
          </div>

          <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
              @click="isModalOpen = false"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>{{ isEditing ? 'Simpan Akun' : 'Tambah Akun' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Akun Bagan Akun"
      :message="`Apakah Anda yakin ingin menghapus akun '${accountToDelete?.accountCode} - ${accountToDelete?.accountName}'?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
