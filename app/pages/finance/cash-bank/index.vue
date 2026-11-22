<script setup lang="ts">
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from 'lucide-vue-next'

const erpStore = useErpStore()
const { formatDateTime } = useDate()
const { formatRupiah } = useCurrency()
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Buku Kas & Bank (Cash & Bank)"
      subtitle="Buku pembantu rekening Bank Mandiri, Bank BCA, serta kas kecil loket Depot Denpasar & Jimbaran."
    />

    <!-- Summary of Cash and Bank Accounts -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-3 bg-white border border-slate-200 rounded shadow-xs">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Bank Mandiri Operasional</span>
          <Landmark class="w-4 h-4 text-blue-600" />
        </div>
        <div class="text-lg font-bold font-mono text-slate-900">
          {{ formatRupiah(142500000) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">Rek: 145-00-1288921-1</div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded shadow-xs">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Bank BCA Giro Distribusi</span>
          <Landmark class="w-4 h-4 text-blue-600" />
        </div>
        <div class="text-lg font-bold font-mono text-slate-900">
          {{ formatRupiah(68400000) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">Rek: 772-0918-200</div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded shadow-xs">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Kas Operasional Denpasar</span>
          <Wallet class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-lg font-bold font-mono text-slate-900">
          {{ formatRupiah(8450000) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">Brankas Loket DPS</div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded shadow-xs">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Kas Operasional Jimbaran</span>
          <Wallet class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-lg font-bold font-mono text-slate-900">
          {{ formatRupiah(5200000) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">Brankas Loket JBR</div>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="p-3 bg-slate-50/80 border-b border-slate-200">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Mutasi Penerimaan & Pengeluaran Kas/Bank Terkini
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">No. Transaksi</th>
              <th class="py-2.5 px-3">Waktu</th>
              <th class="py-2.5 px-3">Akun Kas/Bank</th>
              <th class="py-2.5 px-3">Ref. Transaksi</th>
              <th class="py-2.5 px-3">Deskripsi Transaksi</th>
              <th class="py-2.5 px-3 text-right">Kas Masuk (Debit)</th>
              <th class="py-2.5 px-3 text-right">Kas Keluar (Kredit)</th>
              <th class="py-2.5 px-3 text-right">Saldo Berjalan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="trx in erpStore.cashBankTransactions"
              :key="trx.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ trx.trxNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-500">
                {{ trx.date }}
              </td>
              <td class="py-2.5 px-3 font-medium text-slate-800">
                {{ trx.accountName }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-600">
                {{ trx.referenceNumber }}
              </td>
              <td class="py-2.5 px-3 text-slate-700">
                {{ trx.description }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                {{ trx.type === 'MASUK' ? formatRupiah(trx.amount) : '-' }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                {{ trx.type === 'KELUAR' ? formatRupiah(trx.amount) : '-' }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {{ formatRupiah(trx.runningBalance) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
