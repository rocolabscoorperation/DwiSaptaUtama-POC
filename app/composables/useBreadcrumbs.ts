import { useRoute } from 'vue-router'
import { computed } from 'vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard Eksekutif',
  'master-data': 'Master Data',
  products: 'Produk & Galon',
  customers: 'Pelanggan',
  suppliers: 'Pemasok / Pabrik',
  depots: 'Depot & Cabang',
  purchasing: 'Pengadaan',
  'purchase-orders': 'Pesanan Pembelian (PO)',
  'goods-receipts': 'Penerimaan Barang (GR)',
  inventory: 'Persediaan',
  'stock-overview': 'Ringkasan Stok',
  'stock-movements': 'Mutasi Stok',
  adjustments: 'Stock Opname',
  transfers: 'Transfer Antar Depot',
  sales: 'Penjualan & Distribusi',
  'sales-orders': 'Pesanan Penjualan (SO)',
  deliveries: 'Surat Jalan (DO)',
  invoices: 'Faktur Penjualan',
  finance: 'Keuangan & Akuntansi',
  'chart-of-accounts': 'Bagan Akun (COA)',
  'journal-entries': 'Jurnal Umum',
  'cash-bank': 'Buku Kas & Bank',
  receivables: 'Piutang Usaha (AR)',
  payables: 'Utang Usaha (AP)',
  reports: 'Laporan Manajerial',
  financial: 'Laporan Keuangan',
  settings: 'Pengaturan',
  users: 'Manajemen Pengguna',
  roles: 'Peran & Hak Akses'
}

export const useAppBreadcrumbs = () => {
  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const path = route.path
    if (path === '/' || path === '/dashboard') {
      return [{ label: 'Dashboard' }]
    }

    const segments = path.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [{ label: 'Beranda', to: '/dashboard' }]

    let currentPath = ''
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`
      const isLast = index === segments.length - 1
      const label = ROUTE_LABELS[seg] || seg

      items.push({
        label,
        to: isLast ? undefined : currentPath
      })
    })

    return items
  })

  return {
    breadcrumbs
  }
}

