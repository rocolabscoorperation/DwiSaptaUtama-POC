import type { UserRole } from '../types/auth'

export interface RoleDefinition {
  key: UserRole
  name: string
  description: string
  scope: string
  allowedDepots: 'ALL' | 'ASSIGNED'
  modules: string[]
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  super_admin: {
    key: 'super_admin',
    name: 'Super Admin',
    description: 'Akses penuh ke semua modul sistem, pengelolaan user, hak akses, dan audit trail.',
    scope: 'Seluruh Depot & Modul',
    allowedDepots: 'ALL',
    modules: ['Dashboard', 'Master Data', 'Purchasing', 'Inventory', 'Sales', 'Finance', 'Reports', 'Settings']
  },
  owner: {
    key: 'owner',
    name: 'Owner / Management',
    description: 'Akses eksekutif untuk memantau performa bisnis, dashboard analitik, dan ringkasan keuangan.',
    scope: 'Seluruh Depot (Monitoring)',
    allowedDepots: 'ALL',
    modules: ['Dashboard', 'Reports', 'Finance (Piutang & Utang)']
  },
  admin_depot: {
    key: 'admin_depot',
    name: 'Admin Depot',
    description: 'Mengelola operasional harian depot yang ditugaskan: master data, pengadaan, stok, dan penjualan.',
    scope: 'Depot Tertugaskan',
    allowedDepots: 'ASSIGNED',
    modules: ['Dashboard', 'Master Data', 'Purchasing', 'Inventory', 'Sales']
  },
  purchasing_staff: {
    key: 'purchasing_staff',
    name: 'Purchasing Staff',
    description: 'Mengelola data supplier, order pembelian ke pabrik Danone, dan verifikasi penerimaan barang.',
    scope: 'Depot Tertugaskan',
    allowedDepots: 'ASSIGNED',
    modules: ['Dashboard', 'Master Data (Supplier & Produk)', 'Purchasing']
  },
  warehouse_staff: {
    key: 'warehouse_staff',
    name: 'Warehouse Staff',
    description: 'Mengelola pergerakan fisik barang, kartu stok, stock opname, transfer antar depot, dan serah terima armada.',
    scope: 'Depot Tertugaskan',
    allowedDepots: 'ASSIGNED',
    modules: ['Dashboard', 'Inventory', 'Purchasing (GR)', 'Sales (DO)']
  },
  sales_staff: {
    key: 'sales_staff',
    name: 'Sales Staff',
    description: 'Mengelola pelanggan, pembuatan sales order, koordinasi pengiriman surat jalan, dan penerbitan faktur.',
    scope: 'Depot Tertugaskan',
    allowedDepots: 'ASSIGNED',
    modules: ['Dashboard', 'Master Data (Pelanggan)', 'Sales']
  },
  finance_staff: {
    key: 'finance_staff',
    name: 'Finance Staff',
    description: 'Mengelola pembukuan, jurnal umum, rekening kas/bank, penagihan piutang, pelunasan utang, dan laporan keuangan.',
    scope: 'Seluruh Depot (Keuangan)',
    allowedDepots: 'ALL',
    modules: ['Dashboard', 'Sales (Invoice)', 'Finance', 'Reports']
  }
}

