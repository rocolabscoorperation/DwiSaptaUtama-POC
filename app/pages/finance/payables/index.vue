<script setup lang="ts">
import { useErpStore } from '~/stores/erp'
import { useDate } from '~/composables/useDate'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'

const erpStore = useErpStore()
const { formatDate } = useDate()
const { formatRupiah } = useCurrency()
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Buku Pembantu Utang (Accounts Payable)"
      subtitle="Kewajiban pembayaran atas pembelian Aqua galon dan botol kepada PT Tirta Investama Danone."
    />

    <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-2.5 px-3">Kode Pemasok</th>
              <th class="py-2.5 px-3">Nama Pemasok / Pabrik</th>
              <th class="py-2.5 px-3">No. Tagihan Vendor</th>
              <th class="py-2.5 px-3">Ref. PO</th>
              <th class="py-2.5 px-3">Tgl Tagihan</th>
              <th class="py-2.5 px-3">Jatuh Tempo</th>
              <th class="py-2.5 px-3 text-right">Nilai Tagihan</th>
              <th class="py-2.5 px-3 text-right">Sisa Utang Belum Lunas</th>
              <th class="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in erpStore.payables"
              :key="item.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
                {{ item.supplierCode }}
              </td>
              <td class="py-2.5 px-3 font-semibold text-slate-800">
                {{ item.supplierName }}
              </td>
              <td class="py-2.5 px-3 font-mono text-slate-700">
                {{ item.billNumber }}
              </td>
              <td class="py-2.5 px-3 font-mono text-blue-700">
                {{ item.poNumber }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 font-mono">
                {{ formatDate(item.billDate) }}
              </td>
              <td class="py-2.5 px-3 text-slate-600 font-mono">
                {{ formatDate(item.dueDate) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-medium text-slate-900">
                {{ formatRupiah(item.amount) }}
              </td>
              <td class="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                {{ formatRupiah(item.outstandingAmount) }}
              </td>
              <td class="py-2.5 px-3 text-center">
                <StatusBadge :status="item.status" size="sm" />
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 border-t border-slate-200 font-bold font-mono text-xs">
            <tr>
              <td colspan="7" class="py-2 px-3 text-right uppercase text-[10px] font-sans text-slate-500">
                Total Utang Usaha:
              </td>
              <td class="py-2 px-3 text-right text-amber-800 text-sm">
                {{ formatRupiah(erpStore.payables.reduce((acc, p) => acc + p.outstandingAmount, 0)) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
