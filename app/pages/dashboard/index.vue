<script setup lang="ts">
import { computed } from 'vue'
import { useErpStore } from '~/stores/erp'
import { useDepotStore } from '~/stores/depot'
import { useCurrency } from '~/composables/useCurrency'
import { useDate } from '~/composables/useDate'
import MetricCard from '~/components/shared/MetricCard.vue'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import EChart from '~/components/ui/EChart.client.vue'
import type { EChartsOption } from 'echarts'
import {
  AlertTriangle,
  TrendingUp,
  Package,
  ShoppingBag,
  ArrowRight,
  Truck,
  FileText
} from 'lucide-vue-next'

const erpStore = useErpStore()
const depotStore = useDepotStore()
const { formatRupiah, formatNumber } = useCurrency()
const { formatDate, formatDateTime } = useDate()

const metrics = computed(() => erpStore.dashboardMetrics)

// Sales & Purchasing Trend Chart Option
const trendChartOptions = computed<EChartsOption>(() => {
  const isDenpasar = depotStore.selectedDepotId === 'DEP-001'
  const isJimbaran = depotStore.selectedDepotId === 'DEP-002'

  let salesData = [0, 8.5, 4.5, 0, 1.0, 7.65, 5.0] // in millions
  let purchaseData = [12.2, 0, 10.0, 0, 9.0, 0, 15.9]

  if (isDenpasar) {
    salesData = [0, 8.5, 4.5, 0, 1.0, 0, 5.0]
    purchaseData = [12.2, 0, 0, 0, 9.0, 0, 15.9]
  } else if (isJimbaran) {
    salesData = [0, 0, 0, 0, 0, 7.65, 0.1]
    purchaseData = [0, 0, 10.0, 0, 0, 0, 0]
  }

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let res = `<div class="font-bold text-xs pb-1 border-b mb-1">${params[0]?.axisValue}</div>`
        params.forEach((item: any) => {
          res += `<div class="text-xs flex items-center justify-between gap-4">
            <span style="color:${item.color}">● ${item.seriesName}:</span>
            <span class="font-mono font-bold">Rp ${(item.value * 1000000).toLocaleString('id-ID')}</span>
          </div>`
        })
        return res
      }
    },
    legend: {
      data: ['Penjualan (Sales)', 'Pembelian (Purchasing)'],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#64748b' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['10 Nov', '12 Nov', '14 Nov', '16 Nov', '18 Nov', '20 Nov', '22 Nov'],
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: 'Juta Rupiah',
      axisLine: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        formatter: (val: number) => `Rp ${val}M`
      },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [
      {
        name: 'Penjualan (Sales)',
        type: 'line',
        smooth: true,
        data: salesData,
        itemStyle: { color: '#0f3b6c' },
        lineStyle: { width: 2.5 }
      },
      {
        name: 'Pembelian (Purchasing)',
        type: 'line',
        smooth: true,
        data: purchaseData,
        itemStyle: { color: '#d97706' },
        lineStyle: { width: 2, type: 'dashed' }
      }
    ]
  }
})

// Sales by Product Category/SKU Donut Chart
const productShareChartOptions = computed<EChartsOption>(() => {
  // Aggregate sales by product from filtered sales orders
  const totals: Record<string, number> = {
    'Aqua Galon 19L': 0,
    'Aqua 600ml (Karton)': 0,
    'Aqua 1500ml (Karton)': 0
  }

  erpStore.filteredSalesOrders.forEach((so) => {
    so.items.forEach((item) => {
      if (item.productId === 'PROD-001') {
        totals['Aqua Galon 19L'] += item.subtotal
      } else if (item.productId === 'PROD-002') {
        totals['Aqua 600ml (Karton)'] += item.subtotal
      } else if (item.productId === 'PROD-003') {
        totals['Aqua 1500ml (Karton)'] += item.subtotal
      }
    })
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: (param: any) => {
        return `<div class="text-xs">
          <div class="font-bold">${param.name}</div>
          <div class="mt-1 font-mono">${formatRupiah(param.value)} (${param.percent}%)</div>
        </div>`
      }
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: { fontSize: 11, color: '#64748b' }
    },
    series: [
      {
        name: 'Komposisi Penjualan',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 3,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          }
        },
        data: [
          { value: totals['Aqua Galon 19L'], name: 'Aqua Galon 19L', itemStyle: { color: '#0f3b6c' } },
          { value: totals['Aqua 600ml (Karton)'], name: 'Aqua 600ml (Karton)', itemStyle: { color: '#0284c7' } },
          { value: totals['Aqua 1500ml (Karton)'], name: 'Aqua 1500ml (Karton)', itemStyle: { color: '#0d9488' } }
        ]
      }
    ]
  }
})

// Inventory by Depot Comparison Bar Chart
const inventoryComparisonOptions = computed<EChartsOption>(() => {
  const products = ['Aqua Galon 19L', 'Aqua 600ml', 'Aqua 1500ml', 'Galon Kosong']

  const dpsStock = [480, 145, 65, 310]
  const jbrStock = [320, 75, 95, 180]

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Depot Denpasar (DPS)', 'Depot Jimbaran (JBR)'],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#64748b' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: products,
      axisLabel: { color: '#64748b', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: 'Jumlah Unit',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [
      {
        name: 'Depot Denpasar (DPS)',
        type: 'bar',
        data: dpsStock,
        itemStyle: { color: '#0f3b6c' }
      },
      {
        name: 'Depot Jimbaran (JBR)',
        type: 'bar',
        data: jbrStock,
        itemStyle: { color: '#38bdf8' }
      }
    ]
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <PageHeader
      title="Dashboard Operasional & Eksekutif"
      subtitle="Konsolidasi performa rantai pasok, mutasi stok depot, piutang, dan pengadaan Aqua."
      show-depot-tag
    >
      <template #actions>
        <NuxtLink
          to="/sales/sales-orders"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3b6c] hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <Truck class="w-3.5 h-3.5" />
          <span>Lihat Penjualan</span>
        </NuxtLink>
        <NuxtLink
          to="/inventory/stock-overview"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <Package class="w-3.5 h-3.5" />
          <span>Cek Stok</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <!-- 6 Executive KPI Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <MetricCard
        title="Total Penjualan"
        :value="formatRupiah(metrics.totalSales)"
        subtitle="Bulan berjalan"
        accent-color="blue"
        :trend="{ value: '+14% MoM', isUp: true }"
      />

      <MetricCard
        title="Total Pembelian"
        :value="formatRupiah(metrics.totalPurchases)"
        subtitle="PO ke Danone / vendor"
        accent-color="amber"
      />

      <MetricCard
        title="Nilai Persediaan"
        :value="formatRupiah(metrics.inventoryValue)"
        subtitle="Total aset di gudang"
        accent-color="slate"
      />

      <MetricCard
        title="Piutang Usaha (AR)"
        :value="formatRupiah(metrics.totalReceivables)"
        subtitle="Outstanding invoice"
        accent-color="blue"
        :trend="{ value: '2 Faktur', neutral: true }"
      />

      <MetricCard
        title="Utang Usaha (AP)"
        :value="formatRupiah(metrics.totalPayables)"
        subtitle="Kewajiban pabrik"
        accent-color="amber"
      />

      <MetricCard
        title="Pelanggan Aktif"
        :value="`${metrics.activeCustomersCount} Mitra`"
        subtitle="Corporate & Grosir"
        accent-color="emerald"
      />
    </div>

    <!-- Charts Row: Trend Line & Product Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Sales vs Purchasing Trend (8 cols) -->
      <div class="lg:col-span-8 bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
          <div>
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp class="w-4 h-4 text-blue-700" />
              Tren Penjualan vs Pembelian (November 2026)
            </h3>
            <p class="text-[11px] text-slate-500">
              Perbandingan arus belanja barang masuk dari Danone dan omzet distribusi ke pelanggan.
            </p>
          </div>
          <span class="text-[11px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            Depot: {{ depotStore.selectedDepotId === 'ALL' ? 'Konsolidasi' : depotStore.currentDepot?.code }}
          </span>
        </div>

        <EChart :options="trendChartOptions" height="280px" />
      </div>

      <!-- Sales by Product SKU Donut (4 cols) -->
      <div class="lg:col-span-4 bg-white border border-slate-200 rounded p-4 shadow-xs">
        <div class="mb-2 pb-2 border-b border-slate-100">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag class="w-4 h-4 text-blue-700" />
            Distribusi Produk Terjual
          </h3>
          <p class="text-[11px] text-slate-500">
            Pangsa omzet menurut kategori Aqua Galon vs Aqua Botol.
          </p>
        </div>

        <EChart :options="productShareChartOptions" height="280px" />
      </div>
    </div>

    <!-- Inventory Distribution Comparison Chart (Full row) -->
    <div class="bg-white border border-slate-200 rounded p-4 shadow-xs">
      <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
        <div>
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Package class="w-4 h-4 text-blue-700" />
            Perbandingan Persediaan Fisik Antar Depot (Denpasar vs Jimbaran)
          </h3>
          <p class="text-[11px] text-slate-500">
            Keseimbangan stok Aqua Galon 19L, varian botol, dan galon kosong untuk rotasi operasional.
          </p>
        </div>
        <NuxtLink
          to="/inventory/transfers"
          class="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
        >
          Transfer Antar Depot <ArrowRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <EChart :options="inventoryComparisonOptions" height="230px" />
    </div>

    <!-- Operational Tables Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Recent Sales Orders -->
      <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div class="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Truck class="w-4 h-4 text-blue-700" />
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pesanan Penjualan Terkini (Sales Orders)
            </h3>
          </div>
          <NuxtLink to="/sales/sales-orders" class="text-[11px] font-semibold text-blue-700 hover:underline">
            Semua SO →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-2 px-3">No. SO</th>
                <th class="py-2 px-3">Pelanggan</th>
                <th class="py-2 px-3">Depot</th>
                <th class="py-2 px-3 text-right">Total Nilai</th>
                <th class="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="so in erpStore.recentSales"
                :key="so.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="py-2 px-3 font-mono font-semibold text-blue-900">
                  {{ so.soNumber }}
                </td>
                <td class="py-2 px-3 max-w-[160px] truncate text-slate-800">
                  {{ so.customerName }}
                </td>
                <td class="py-2 px-3 text-slate-600 truncate max-w-[100px]">
                  {{ so.depotName.replace('Depot ', '') }}
                </td>
                <td class="py-2 px-3 text-right font-mono font-medium text-slate-900">
                  {{ formatRupiah(so.totalAmount) }}
                </td>
                <td class="py-2 px-3 text-center">
                  <StatusBadge :status="so.status" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Critical Stock / Low Stock Alerts -->
      <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div class="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 text-amber-600" />
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Peringatan Stok Mendekati Minimum
            </h3>
          </div>
          <span class="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {{ erpStore.lowStockAlerts.length }} Produk Perlu Restock
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-2 px-3">Produk</th>
                <th class="py-2 px-3">Depot</th>
                <th class="py-2 px-3 text-right">Stok Aktual</th>
                <th class="py-2 px-3 text-right">Batas Min</th>
                <th class="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in erpStore.lowStockAlerts"
                :key="`${item.depotId}-${item.productId}`"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="py-2 px-3 font-semibold text-slate-800">
                  {{ item.productName }}
                </td>
                <td class="py-2 px-3 text-slate-600">
                  {{ item.depotName.replace('Depot ', '') }}
                </td>
                <td class="py-2 px-3 text-right font-mono font-bold text-amber-700">
                  {{ formatNumber(item.quantity) }} {{ item.unit }}
                </td>
                <td class="py-2 px-3 text-right font-mono text-slate-500">
                  {{ formatNumber(item.minStock) }}
                </td>
                <td class="py-2 px-3 text-center">
                  <StatusBadge :status="item.status" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Purchase Orders -->
      <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div class="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingBag class="w-4 h-4 text-blue-700" />
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pengadaan Barang Pabrik Terkini (PO)
            </h3>
          </div>
          <NuxtLink to="/purchasing/purchase-orders" class="text-[11px] font-semibold text-blue-700 hover:underline">
            Semua PO →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-2 px-3">No. PO</th>
                <th class="py-2 px-3">Pemasok</th>
                <th class="py-2 px-3">Tgl Order</th>
                <th class="py-2 px-3 text-right">Total Nilai</th>
                <th class="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="po in erpStore.recentPurchaseOrders"
                :key="po.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="py-2 px-3 font-mono font-semibold text-blue-900">
                  {{ po.poNumber }}
                </td>
                <td class="py-2 px-3 truncate max-w-[150px] text-slate-800">
                  {{ po.supplierName }}
                </td>
                <td class="py-2 px-3 text-slate-500">
                  {{ formatDate(po.orderDate) }}
                </td>
                <td class="py-2 px-3 text-right font-mono font-medium text-slate-900">
                  {{ formatRupiah(po.totalAmount) }}
                </td>
                <td class="py-2 px-3 text-center">
                  <StatusBadge :status="po.status" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Outstanding Invoices / Receivables -->
      <div class="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div class="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-blue-700" />
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Faktur Tagihan Piutang Terbuka (Unpaid Invoices)
            </h3>
          </div>
          <NuxtLink to="/finance/receivables" class="text-[11px] font-semibold text-blue-700 hover:underline">
            Buku Piutang →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-2 px-3">No. Faktur</th>
                <th class="py-2 px-3">Pelanggan</th>
                <th class="py-2 px-3">Jatuh Tempo</th>
                <th class="py-2 px-3 text-right">Sisa Piutang</th>
                <th class="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="inv in erpStore.outstandingInvoices"
                :key="inv.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <td class="py-2 px-3 font-mono font-semibold text-blue-900">
                  {{ inv.invoiceNumber }}
                </td>
                <td class="py-2 px-3 truncate max-w-[160px] text-slate-800">
                  {{ inv.customerName }}
                </td>
                <td class="py-2 px-3 text-slate-600">
                  {{ formatDate(inv.dueDate) }}
                </td>
                <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {{ formatRupiah(inv.outstandingAmount) }}
                </td>
                <td class="py-2 px-3 text-center">
                  <StatusBadge :status="inv.status" size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
