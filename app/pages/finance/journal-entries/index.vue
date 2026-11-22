<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import type { JournalEntry } from '~~/shared/types'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue'
import { CheckCircle2, AlertTriangle, Plus, Trash2, X, Check, FileSpreadsheet } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatRupiah } = useCurrency()

// Add Journal Entry Modal State
const isAddModalOpen = ref(false)
const journalForm = reactive({
  date: new Date().toISOString().split('T')[0],
  referenceNumber: `MEMO-2026-${String(erpStore.journalEntries.length + 1).padStart(3, '0')}`,
  description: '',
  postedBy: 'Kadek Dwi Handayani, S.Ak.',
  debitAccountCode: '1010',
  debitAmount: 1000000,
  creditAccountCode: '4010',
  creditAmount: 1000000
})

const isBalanced = computed(() => {
  return journalForm.debitAmount > 0 && journalForm.debitAmount === journalForm.creditAmount
})

const openAddModal = () => {
  journalForm.date = new Date().toISOString().split('T')[0]
  journalForm.referenceNumber = `MEMO-2026-${String(erpStore.journalEntries.length + 1).padStart(3, '0')}`
  journalForm.description = 'Penyesuaian kas kecil operasional loket depot.'
  journalForm.debitAccountCode = erpStore.chartOfAccounts[0]?.accountCode || '1010'
  journalForm.debitAmount = 1500000
  journalForm.creditAccountCode = erpStore.chartOfAccounts.find(a => a.category === 'Pendapatan')?.accountCode || '4010'
  journalForm.creditAmount = 1500000
  isAddModalOpen.value = true
}

const saveJournal = () => {
  if (!isBalanced.value) return

  const debitAcc = erpStore.chartOfAccounts.find(a => a.accountCode === journalForm.debitAccountCode)
  const creditAcc = erpStore.chartOfAccounts.find(a => a.accountCode === journalForm.creditAccountCode)

  erpStore.addJournalEntry({
    date: journalForm.date,
    referenceType: 'MANUAL',
    referenceNumber: journalForm.referenceNumber,
    description: journalForm.description,
    status: 'Posted',
    postedBy: journalForm.postedBy,
    totalDebit: Number(journalForm.debitAmount),
    totalCredit: Number(journalForm.creditAmount),
    lines: [
      {
        accountCode: debitAcc?.accountCode || journalForm.debitAccountCode,
        accountName: debitAcc?.accountName || 'Debit Account',
        debit: Number(journalForm.debitAmount),
        credit: 0,
        note: 'Ayat debit manual'
      },
      {
        accountCode: creditAcc?.accountCode || journalForm.creditAccountCode,
        accountName: creditAcc?.accountName || 'Credit Account',
        debit: 0,
        credit: Number(journalForm.creditAmount),
        note: 'Ayat kredit manual'
      }
    ]
  })

  isAddModalOpen.value = false
}

// Delete Journal State
const isDeleteOpen = ref(false)
const journalToDelete = ref<JournalEntry | null>(null)

const promptDelete = (jrn: JournalEntry) => {
  journalToDelete.value = jrn
  isDeleteOpen.value = true
}

const confirmDelete = () => {
  if (journalToDelete.value) {
    erpStore.deleteJournalEntry(journalToDelete.value.id)
  }
  isDeleteOpen.value = false
  journalToDelete.value = null
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Jurnal Umum (General Journal Entries)"
      subtitle="Pencatatan ayat jurnal berpasangan (double-entry), otomatis terhubung ke PO, DO, dan Invoice penjualan."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="openAddModal"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Buat Jurnal Manual</span>
        </button>
      </template>
    </PageHeader>

    <div class="space-y-3">
      <div
        v-for="entry in erpStore.journalEntries"
        :key="entry.id"
        class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden"
      >
        <!-- Header Entry -->
        <div class="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {{ entry.journalNumber }}
            </span>
            <span class="font-mono text-slate-500">{{ formatDate(entry.date) }}</span>
            <span class="text-slate-700 font-medium truncate max-w-md">{{ entry.description }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] text-slate-500">Ref: {{ entry.referenceNumber }}</span>
            <StatusBadge :status="entry.status" size="sm" />
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 class="w-3 h-3" /> Balanced
            </span>
            <button
              type="button"
              class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded ml-1 transition-colors"
              title="Hapus Ayat Jurnal"
              @click="promptDelete(entry)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Journal Lines Table -->
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2 px-3 w-28">Kode Akun</th>
              <th class="py-2 px-3">Nama Akun & Keterangan</th>
              <th class="py-2 px-3 text-right w-36">Debit</th>
              <th class="py-2 px-3 text-right w-36">Kredit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(line, idx) in entry.lines"
              :key="idx"
              class="hover:bg-slate-50/60"
            >
              <td class="py-2 px-3 font-mono font-semibold text-slate-800">
                {{ line.accountCode }}
              </td>
              <td class="py-2 px-3" :class="{ 'pl-8': line.credit > 0 }">
                <div class="font-medium text-slate-800">{{ line.accountName }}</div>
                <div v-if="line.note" class="text-[10px] text-slate-500 italic">{{ line.note }}</div>
              </td>
              <td class="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                {{ line.debit > 0 ? formatRupiah(line.debit) : '-' }}
              </td>
              <td class="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                {{ line.credit > 0 ? formatRupiah(line.credit) : '-' }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50/50 border-t border-slate-200 text-xs font-bold font-mono">
            <tr>
              <td colspan="2" class="py-2 px-3 text-right uppercase text-[10px] text-slate-500 font-sans tracking-wider">
                Total Seimbang:
              </td>
              <td class="py-2 px-3 text-right text-emerald-800">
                {{ formatRupiah(entry.totalDebit) }}
              </td>
              <td class="py-2 px-3 text-right text-emerald-800">
                {{ formatRupiah(entry.totalCredit) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Create Journal Form Modal -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div class="bg-white rounded border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div class="px-4 py-3 bg-[#0b2447] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileSpreadsheet class="w-4 h-4 text-blue-400" />
            <h3 class="text-sm font-bold">Catat Ayat Jurnal Umum Manual</h3>
          </div>
          <button type="button" class="text-slate-300 hover:text-white" @click="isAddModalOpen = false">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form class="p-4 space-y-3.5 text-xs" @submit.prevent="saveJournal">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
              <input
                v-model="journalForm.date"
                type="date"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">No. Bukti Referensi</label>
              <input
                v-model="journalForm.referenceNumber"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
                placeholder="MEMO-001"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Keterangan Jurnal</label>
            <input
              v-model="journalForm.description"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
              placeholder="Deskripsi transaksi pembukuan..."
            />
          </div>

          <!-- Debit Line -->
          <div class="p-2.5 rounded bg-blue-50/50 border border-blue-200 space-y-2">
            <div class="font-bold uppercase tracking-wider text-[10px] text-blue-900">Sisi Debit (Akun Masuk/Beban)</div>
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <select
                  v-model="journalForm.debitAccountCode"
                  class="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                >
                  <option v-for="a in erpStore.chartOfAccounts" :key="a.accountCode" :value="a.accountCode">
                    {{ a.accountCode }} - {{ a.accountName }}
                  </option>
                </select>
              </div>
              <div>
                <input
                  v-model.number="journalForm.debitAmount"
                  type="number"
                  min="1"
                  required
                  placeholder="Nominal Debit"
                  class="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-right text-xs"
                />
              </div>
            </div>
          </div>

          <!-- Credit Line -->
          <div class="p-2.5 rounded bg-amber-50/50 border border-amber-200 space-y-2">
            <div class="font-bold uppercase tracking-wider text-[10px] text-amber-900">Sisi Kredit (Akun Keluar/Pendapatan)</div>
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <select
                  v-model="journalForm.creditAccountCode"
                  class="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                >
                  <option v-for="a in erpStore.chartOfAccounts" :key="a.accountCode" :value="a.accountCode">
                    {{ a.accountCode }} - {{ a.accountName }}
                  </option>
                </select>
              </div>
              <div>
                <input
                  v-model.number="journalForm.creditAmount"
                  type="number"
                  min="1"
                  required
                  placeholder="Nominal Kredit"
                  class="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-right text-xs"
                />
              </div>
            </div>
          </div>

          <!-- Balance Validation Banner -->
          <div
            class="p-2 rounded text-xs font-semibold flex items-center justify-between"
            :class="isBalanced ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'"
          >
            <div class="flex items-center gap-1.5">
              <CheckCircle2 v-if="isBalanced" class="w-4 h-4 text-emerald-600" />
              <AlertTriangle v-else class="w-4 h-4 text-rose-600" />
              <span>{{ isBalanced ? 'Jurnal Seimbang (Balanced)' : 'Debit dan Kredit Belum Seimbang!' }}</span>
            </div>
            <span class="font-mono">{{ formatRupiah(journalForm.debitAmount) }} / {{ formatRupiah(journalForm.creditAmount) }}</span>
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
              :disabled="!isBalanced"
              class="px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold rounded shadow-xs flex items-center gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>Posting Jurnal</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="isDeleteOpen"
      title="Hapus Ayat Jurnal"
      :message="`Apakah Anda yakin ingin membatalkan/menghapus ayat jurnal '${journalToDelete?.journalNumber}' (${journalToDelete?.description})?`"
      @confirm="confirmDelete"
      @cancel="isDeleteOpen = false"
    />
  </div>
</template>
