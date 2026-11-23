<script setup lang="ts">
import { ref } from 'vue'
import { useCurrency } from '~/composables/useCurrency'
import PageHeader from '~/components/shared/PageHeader.vue'
import { FileDown, Printer, CheckCircle2, Loader2 } from 'lucide-vue-next'

const { formatRupiah } = useCurrency()

// Income statement breakdown (Simulated Month of November 2026)
const revenueGalon = 18000000
const revenueBotol = 8750000
const totalRevenue = revenueGalon + revenueBotol

const cogsGalon = 14400000
const cogsBotol = 7350000
const totalCogs = cogsGalon + cogsBotol

const grossProfit = totalRevenue - totalCogs

const expenseBBM = 3600000
const expenseGaji = 12500000
const expenseServis = 1850000
const expenseUtilitas = 2400000
const totalExpenses = expenseBBM + expenseGaji + expenseServis + expenseUtilitas

const netOperatingIncome = grossProfit - totalExpenses

const reportSheetRef = ref<HTMLDivElement | null>(null)
const isExporting = ref(false)

const exportPDF = async () => {
  if (typeof window === 'undefined') return
  isExporting.value = true

  try {
    const { default: jsPDF } = await import('jspdf')
    const { default: html2canvas } = await import('html2canvas')

    if (!reportSheetRef.value) return

    const canvas = await html2canvas(reportSheetRef.value, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width mm
    const pageHeight = 297 // A4 height mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('Laporan_Laba_Rugi_PT_Dwi_Sapta_Utama_Nov2026.pdf')
  } catch (error) {
    console.error('Gagal export PDF:', error)
    // Fallback to window.print if canvas export fails
    window.print()
  } finally {
    isExporting.value = false
  }
}

const printReport = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader title="Laporan Keuangan Manajerial (Financial Reports)"
      subtitle="Ikhtisar Laba Rugi Operasional (P&L) usaha distribusi Aqua untuk manajemen dan pemilik.">
      <template #actions>
        <button type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors"
          title="Cetak via dialog browser" @click="printReport">
          <Printer class="w-3.5 h-3.5" />
          <span>Cetak / Cetak PDF</span>
        </button>

        <button type="button" :disabled="isExporting"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 disabled:bg-blue-400 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          @click="exportPDF">
          <Loader2 v-if="isExporting" class="w-3.5 h-3.5 animate-spin" />
          <FileDown v-else class="w-3.5 h-3.5" />
          <span>{{ isExporting ? 'Memproses PDF...' : 'Unduh Dokumen PDF' }}</span>
        </button>
      </template>
    </PageHeader>

    <!-- Printable Financial Statement Sheet -->
    <div id="financial-report-sheet" ref="reportSheetRef"
      class="bg-white border border-slate-200 rounded shadow-xs p-6 md:p-8 max-w-4xl mx-auto space-y-6 print-card"
      style="font-family: var(--sap-font, '72', '72full', -apple-system, 'Segoe UI', Arial, sans-serif);">
      <!-- Official Corporate Header -->
      <div class="flex items-start justify-between pb-4 border-b-2 border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <div>
              <h2 class="text-base font-bold text-slate-900 uppercase tracking-tight leading-none">
                PT Dwi Sapta Utama
              </h2>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                Distributor Resmi Danone Aqua Bali
              </p>
            </div>
          </div>
          <p class="text-[11px] text-slate-600 mt-2 max-w-md">
            Pangkalan Distribusi: Denpasar Barat & Jimbaran Badung, Bali<br />
            Telp: (0361) 234567 | NPWP: 01.345.678.9-901.000
          </p>
        </div>

        <div class="text-right">
          <div
            class="inline-block px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono font-bold text-slate-700 uppercase">
            Dokumen Rahasia Internal
          </div>
          <div class="text-[11px] font-mono text-slate-500 mt-1">No: LAP-KEU-2026-11</div>
          <div class="text-[11px] text-slate-500">Periode: 01 Nov - 30 Nov 2026</div>
        </div>
      </div>

      <div class="text-center pt-2 pb-2">
        <h3 class="text-sm font-bold text-[#0f3b6c] uppercase tracking-wider">
          Laporan Laba Rugi Operasional (Income Statement)
        </h3>
        <p class="text-xs text-slate-500 font-mono">Bulan Berjalan: November 2026 (Mata Uang: IDR / Rupiah)</p>
      </div>

      <!-- Pendapatan -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1.5 border-b border-slate-300">
          I. Pendapatan Usaha Penjualan (Revenue)
        </h4>
        <div class="divide-y divide-slate-100 text-xs">
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Pendapatan Penjualan Aqua Galon 19 Liter (Akun 4010)</span>
            <span class="font-mono font-medium text-slate-900">{{ formatRupiah(revenueGalon) }}</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Pendapatan Penjualan Aqua Botol 600ml & 1500ml (Akun 4020)</span>
            <span class="font-mono font-medium text-slate-900">{{ formatRupiah(revenueBotol) }}</span>
          </div>
          <div class="py-2.5 flex justify-between font-bold bg-slate-50 px-2 rounded">
            <span class="text-slate-900 uppercase text-[11px]">Total Pendapatan Usaha</span>
            <span class="font-mono text-[#0f3b6c]">{{ formatRupiah(totalRevenue) }}</span>
          </div>
        </div>
      </div>

      <!-- Beban Pokok Penjualan -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1.5 border-b border-slate-300">
          II. Beban Pokok Penjualan (Cost of Goods Sold - HPP)
        </h4>
        <div class="divide-y divide-slate-100 text-xs">
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">HPP Pembelian Aqua Galon Pabrik Danone Mambal (Akun 5010)</span>
            <span class="font-mono font-medium text-slate-900">({{ formatRupiah(cogsGalon) }})</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">HPP Pembelian Aqua Botol Pabrik Danone Mambal (Akun 5020)</span>
            <span class="font-mono font-medium text-slate-900">({{ formatRupiah(cogsBotol) }})</span>
          </div>
          <div class="py-2.5 flex justify-between font-bold bg-slate-50 px-2 rounded">
            <span class="text-slate-900 uppercase text-[11px]">Total Beban Pokok Penjualan</span>
            <span class="font-mono text-rose-800">({{ formatRupiah(totalCogs) }})</span>
          </div>
        </div>
      </div>

      <!-- Laba Kotor -->
      <div class="p-3 bg-blue-50 border border-blue-200 rounded flex justify-between items-center text-xs font-bold">
        <span class="uppercase tracking-wider text-blue-900">Laba Kotor Operasional (Gross Profit)</span>
        <span class="text-sm font-mono text-[#0f3b6c]">{{ formatRupiah(grossProfit) }}</span>
      </div>

      <!-- Beban Operasional -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1.5 border-b border-slate-300">
          III. Beban Operasional & Distribusi (Operating Expenses)
        </h4>
        <div class="divide-y divide-slate-100 text-xs">
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Beban Gaji & Insentif Sopir / Helper Distribusi (Akun 6020)</span>
            <span class="font-mono text-slate-800">({{ formatRupiah(expenseGaji) }})</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Beban Bahan Bakar Solar & Bensin Truk Armada (Akun 6010)</span>
            <span class="font-mono text-slate-800">({{ formatRupiah(expenseBBM) }})</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Beban Listrik, Air & Utilitas Kantor Depot (Akun 6040)</span>
            <span class="font-mono text-slate-800">({{ formatRupiah(expenseUtilitas) }})</span>
          </div>
          <div class="py-2 flex justify-between">
            <span class="text-slate-700 pl-3">Beban Pemeliharaan & Perbaikan Kendaraan (Akun 6030)</span>
            <span class="font-mono text-slate-800">({{ formatRupiah(expenseServis) }})</span>
          </div>
          <div class="py-2.5 flex justify-between font-bold bg-slate-50 px-2 rounded">
            <span class="text-slate-900 uppercase text-[11px]">Total Beban Operasional Usaha</span>
            <span class="font-mono text-rose-800">({{ formatRupiah(totalExpenses) }})</span>
          </div>
        </div>
      </div>

      <!-- Laba Bersih Operasional -->
      <div
        class="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded flex justify-between items-center text-xs font-bold">
        <div>
          <div class="uppercase tracking-wider text-emerald-900 text-sm">Laba Bersih Operasional Berjalan (Net Operating
            Income)</div>
          <div class="text-[11px] text-emerald-700 font-normal">Hasil usaha operasional sebelum beban pajak & penyusutan
            tahunan</div>
        </div>
        <span class="text-base font-mono text-emerald-800">{{ formatRupiah(netOperatingIncome) }}</span>
      </div>

      <!-- Signatures Footer -->
      <div class="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-700">
        <div>
          <div class="text-slate-500 mb-12">Disiapkan Oleh:</div>
          <div class="font-bold underline text-slate-900">Kadek Dwi Handayani, S.Ak.</div>
          <div class="text-[11px] text-slate-500">Staf Keuangan & Akuntansi</div>
        </div>
        <div>
          <div class="text-slate-500 mb-12">Disetujui Oleh:</div>
          <div class="font-bold underline text-slate-900">Ir. H. Gunawan</div>
          <div class="text-[11px] text-slate-500">Direktur / Owner</div>
        </div>
      </div>
    </div>
  </div>
</template>
