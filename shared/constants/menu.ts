import type { UserRole } from '../types/auth'

export interface MenuItem {
  id: string
  label: string
  to?: string
  icon: string
  roles: UserRole[]
  children?: {
    id: string
    label: string
    to: string
    roles: UserRole[]
  }[]
}

export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Eksekutif',
    to: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['super_admin', 'owner', 'admin_depot', 'purchasing_staff', 'warehouse_staff', 'sales_staff', 'finance_staff']
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: 'Database',
    roles: ['super_admin', 'admin_depot', 'purchasing_staff', 'sales_staff'],
    children: [
      {
        id: 'products',
        label: 'Produk & Galon',
        to: '/master-data/products',
        roles: ['super_admin', 'admin_depot', 'purchasing_staff', 'sales_staff']
      },
      {
        id: 'customers',
        label: 'Pelanggan',
        to: '/master-data/customers',
        roles: ['super_admin', 'admin_depot', 'sales_staff']
      },
      {
        id: 'suppliers',
        label: 'Pemasok / Pabrik',
        to: '/master-data/suppliers',
        roles: ['super_admin', 'admin_depot', 'purchasing_staff']
      },
      {
        id: 'depots',
        label: 'Depot & Cabang',
        to: '/master-data/depots',
        roles: ['super_admin', 'admin_depot']
      }
    ]
  },
  {
    id: 'purchasing',
    label: 'Pengadaan (Purchasing)',
    icon: 'ShoppingBag',
    roles: ['super_admin', 'admin_depot', 'purchasing_staff'],
    children: [
      {
        id: 'purchase-orders',
        label: 'Pesanan Pembelian (PO)',
        to: '/purchasing/purchase-orders',
        roles: ['super_admin', 'admin_depot', 'purchasing_staff']
      },
      {
        id: 'goods-receipts',
        label: 'Penerimaan Barang (GR)',
        to: '/purchasing/goods-receipts',
        roles: ['super_admin', 'admin_depot', 'purchasing_staff', 'warehouse_staff']
      }
    ]
  },
  {
    id: 'inventory',
    label: 'Persediaan (Inventory)',
    icon: 'Warehouse',
    roles: ['super_admin', 'admin_depot', 'warehouse_staff'],
    children: [
      {
        id: 'stock-overview',
        label: 'Ringkasan Stok',
        to: '/inventory/stock-overview',
        roles: ['super_admin', 'admin_depot', 'warehouse_staff']
      },
      {
        id: 'stock-movements',
        label: 'Mutasi & Kartu Stok',
        to: '/inventory/stock-movements',
        roles: ['super_admin', 'admin_depot', 'warehouse_staff']
      },
      {
        id: 'adjustments',
        label: 'Stock Opname & Penyesuaian',
        to: '/inventory/adjustments',
        roles: ['super_admin', 'admin_depot', 'warehouse_staff']
      },
      {
        id: 'transfers',
        label: 'Transfer Antar Depot',
        to: '/inventory/transfers',
        roles: ['super_admin', 'admin_depot', 'warehouse_staff']
      }
    ]
  },
  {
    id: 'sales',
    label: 'Penjualan & Distribusi',
    icon: 'Truck',
    roles: ['super_admin', 'admin_depot', 'sales_staff'],
    children: [
      {
        id: 'sales-orders',
        label: 'Pesanan Penjualan (SO)',
        to: '/sales/sales-orders',
        roles: ['super_admin', 'admin_depot', 'sales_staff']
      },
      {
        id: 'deliveries',
        label: 'Surat Jalan & Pengiriman (DO)',
        to: '/sales/deliveries',
        roles: ['super_admin', 'admin_depot', 'sales_staff', 'warehouse_staff']
      },
      {
        id: 'invoices',
        label: 'Faktur Penjualan (Invoice)',
        to: '/sales/invoices',
        roles: ['super_admin', 'admin_depot', 'sales_staff', 'finance_staff']
      }
    ]
  },
  {
    id: 'finance',
    label: 'Keuangan & Akuntansi',
    icon: 'Landmark',
    roles: ['super_admin', 'owner', 'finance_staff'],
    children: [
      {
        id: 'chart-of-accounts',
        label: 'Bagan Akun (COA)',
        to: '/finance/chart-of-accounts',
        roles: ['super_admin', 'finance_staff']
      },
      {
        id: 'journal-entries',
        label: 'Jurnal Umum (Journal Entries)',
        to: '/finance/journal-entries',
        roles: ['super_admin', 'finance_staff']
      },
      {
        id: 'cash-bank',
        label: 'Buku Kas & Bank',
        to: '/finance/cash-bank',
        roles: ['super_admin', 'finance_staff']
      },
      {
        id: 'receivables',
        label: 'Buku Pembantu Piutang (AR)',
        to: '/finance/receivables',
        roles: ['super_admin', 'finance_staff', 'owner']
      },
      {
        id: 'payables',
        label: 'Buku Pembantu Utang (AP)',
        to: '/finance/payables',
        roles: ['super_admin', 'finance_staff', 'owner']
      }
    ]
  },
  {
    id: 'reports',
    label: 'Laporan Manajerial',
    icon: 'FileBarChart',
    roles: ['super_admin', 'owner', 'finance_staff'],
    children: [
      {
        id: 'sales-reports',
        label: 'Laporan Penjualan',
        to: '/reports/sales',
        roles: ['super_admin', 'owner', 'finance_staff']
      },
      {
        id: 'inventory-reports',
        label: 'Laporan Persediaan',
        to: '/reports/inventory',
        roles: ['super_admin', 'owner', 'finance_staff']
      },
      {
        id: 'financial-reports',
        label: 'Laporan Keuangan',
        to: '/reports/financial',
        roles: ['super_admin', 'owner', 'finance_staff']
      }
    ]
  },
  {
    id: 'settings',
    label: 'Pengaturan Sistem',
    icon: 'Settings',
    roles: ['super_admin'],
    children: [
      {
        id: 'users',
        label: 'Manajemen Pengguna',
        to: '/settings/users',
        roles: ['super_admin']
      },
      {
        id: 'roles',
        label: 'Peran & Hak Akses',
        to: '/settings/roles',
        roles: ['super_admin']
      }
    ]
  }
]

