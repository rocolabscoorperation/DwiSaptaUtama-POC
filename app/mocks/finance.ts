import type {
  ChartOfAccount,
  JournalEntry,
  CashBankTransaction,
  ReceivableItem,
  PayableItem
} from '~~/shared/types'

export const mockChartOfAccounts: ChartOfAccount[] = [
  // Aset Lancar
  {
    accountCode: '1010',
    accountName: 'Kas Operasional Denpasar',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 8450000,
    description: 'Kas tunai operasional harian di loket Depot Denpasar'
  },
  {
    accountCode: '1011',
    accountName: 'Kas Operasional Jimbaran',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 5200000,
    description: 'Kas tunai operasional harian di loket Depot Jimbaran'
  },
  {
    accountCode: '1020',
    accountName: 'Bank Mandiri Distribusi (Operasional)',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 142500000,
    description: 'Rekening utama penampungan transfer pelanggan korporat & reseller'
  },
  {
    accountCode: '1021',
    accountName: 'Bank BCA Rekening Giro Distribusi',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 68400000,
    description: 'Rekening operasional transaksi kliring & pembayaran vendor'
  },
  {
    accountCode: '1030',
    accountName: 'Piutang Usaha (Pelanggan)',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 16150000,
    description: 'Tagihan penjualan kredit ke pelanggan korporat dan toko reseller'
  },
  {
    accountCode: '1040',
    accountName: 'Persediaan Barang Dagang (Aqua Air Minum)',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 26640000,
    description: 'Nilai persediaan fisik Aqua Galon 19L dan varian botol di seluruh depot'
  },
  {
    accountCode: '1041',
    accountName: 'Persediaan Galon Kosong (Sirkulasi)',
    category: 'Aset Lancar',
    normalBalance: 'Debit',
    balance: 14700000,
    description: 'Nilai aset persediaan galon kosong polikarbonat 19L'
  },

  // Kewajiban
  {
    accountCode: '2010',
    accountName: 'Utang Usaha - Pabrik Danone Mambal',
    category: 'Kewajiban Lancar',
    normalBalance: 'Kredit',
    balance: 27100000,
    description: 'Kewajiban pembayaran faktur pembelian barang ke produsen'
  },
  {
    accountCode: '2020',
    accountName: 'Utang Biaya Operasional & Armada',
    category: 'Kewajiban Lancar',
    normalBalance: 'Kredit',
    balance: 4800000,
    description: 'Beban berjalan yang belum jatuh tempo (servis kendaraan, BBM)'
  },
  {
    accountCode: '2030',
    accountName: 'Titipan Deposit Jaminan Galon Pelanggan',
    category: 'Kewajiban Lancar',
    normalBalance: 'Kredit',
    balance: 18500000,
    description: 'Uang deposit jaminan galon dari pelanggan non-tukar langsung'
  },

  // Ekuitas
  {
    accountCode: '3010',
    accountName: 'Modal Disetor Pemilik',
    category: 'Ekuitas',
    normalBalance: 'Kredit',
    balance: 200000000,
    description: 'Modal awal pendirian usaha distribusi Aqua'
  },
  {
    accountCode: '3020',
    accountName: 'Laba Ditahan (Retained Earnings)',
    category: 'Ekuitas',
    normalBalance: 'Kredit',
    balance: 31240000,
    description: 'Akumulasi laba bersih periode sebelumnya'
  },

  // Pendapatan
  {
    accountCode: '4010',
    accountName: 'Pendapatan Penjualan Aqua Galon 19L',
    category: 'Pendapatan',
    normalBalance: 'Kredit',
    balance: 18000000,
    description: 'Total omzet penjualan produk galon 19 liter bulan berjalan'
  },
  {
    accountCode: '4020',
    accountName: 'Pendapatan Penjualan Aqua Botol (600ml & 1500ml)',
    category: 'Pendapatan',
    normalBalance: 'Kredit',
    balance: 8750000,
    description: 'Total omzet penjualan produk kartonan botol bulan berjalan'
  },

  // HPP
  {
    accountCode: '5010',
    accountName: 'Beban Pokok Penjualan (HPP) Aqua Galon',
    category: 'Beban Pokok Penjualan',
    normalBalance: 'Debit',
    balance: 14400000,
    description: 'Biaya perolehan produk galon yang berhasil terjual'
  },
  {
    accountCode: '5020',
    accountName: 'Beban Pokok Penjualan (HPP) Aqua Botol',
    category: 'Beban Pokok Penjualan',
    normalBalance: 'Debit',
    balance: 7350000,
    description: 'Biaya perolehan produk botol yang berhasil terjual'
  },

  // Beban Operasional
  {
    accountCode: '6010',
    accountName: 'Beban Bahan Bakar Solar & Bensin Armada',
    category: 'Beban Operasional',
    normalBalance: 'Debit',
    balance: 3600000,
    description: 'Biaya BBM truk dan pickup pengiriman galon harian'
  },
  {
    accountCode: '6020',
    accountName: 'Beban Gaji & Insentif Sopir / Helper Distribusi',
    category: 'Beban Operasional',
    normalBalance: 'Debit',
    balance: 12500000,
    description: 'Alokasi upah tenaga kerja operasional pengantaran'
  },
  {
    accountCode: '6030',
    accountName: 'Beban Pemeliharaan & Servis Kendaraan',
    category: 'Beban Operasional',
    normalBalance: 'Debit',
    balance: 1850000,
    description: 'Biaya perawatan rutin ban, oli, dan mesin armada'
  },
  {
    accountCode: '6040',
    accountName: 'Beban Listrik, Air & Kebersihan Gudang Depot',
    category: 'Beban Operasional',
    normalBalance: 'Debit',
    balance: 2400000,
    description: 'Biaya utilitas kantor dan gudang penyimpanan'
  }
]

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'JRN-001',
    journalNumber: 'JRN-2026-001',
    date: '2026-11-12',
    referenceType: 'GR',
    referenceNumber: 'GR-2026-001',
    description: 'Penerimaan barang PO-2026-001 dari PT Tirta Investama Danone Mambal (DPS)',
    lines: [
      {
        accountCode: '1040',
        accountName: 'Persediaan Barang Dagang (Aqua Air Minum)',
        debit: 12200000,
        credit: 0,
        note: 'Penerimaan 500 Galon 19L & 100 Dus 600ml'
      },
      {
        accountCode: '2010',
        accountName: 'Utang Usaha - Pabrik Danone Mambal',
        debit: 0,
        credit: 12200000,
        note: 'Faktur pembelian PO-2026-001 TOP 30'
      }
    ],
    totalDebit: 12200000,
    totalCredit: 12200000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  },
  {
    id: 'JRN-002',
    journalNumber: 'JRN-2026-002',
    date: '2026-11-14',
    referenceType: 'INV',
    referenceNumber: 'INV-2026-001',
    description: 'Pengakuan piutang penjualan SO-2026-001 ke PT Bali Sunset Resort & Spa Hotel',
    lines: [
      {
        accountCode: '1030',
        accountName: 'Piutang Usaha (Pelanggan)',
        debit: 8500000,
        credit: 0,
        note: 'Faktur INV-2026-001 jatuh tempo 14 Des 2026'
      },
      {
        accountCode: '4010',
        accountName: 'Pendapatan Penjualan Aqua Galon 19L',
        debit: 0,
        credit: 7000000,
        note: '350 Galon @ Rp 20.000'
      },
      {
        accountCode: '4020',
        accountName: 'Pendapatan Penjualan Aqua Botol',
        debit: 0,
        credit: 1500000,
        note: '30 Dus 600ml @ Rp 50.000'
      }
    ],
    totalDebit: 8500000,
    totalCredit: 8500000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  },
  {
    id: 'JRN-003',
    journalNumber: 'JRN-2026-003',
    date: '2026-11-14',
    referenceType: 'DO',
    referenceNumber: 'DO-2026-001',
    description: 'Pencatatan HPP atas pengiriman barang SO-2026-001 (DO-2026-001)',
    lines: [
      {
        accountCode: '5010',
        accountName: 'Beban Pokok Penjualan (HPP) Aqua Galon',
        debit: 5600000,
        credit: 0,
        note: '350 Galon @ Rp 16.000 (Harga Beli)'
      },
      {
        accountCode: '5020',
        accountName: 'Beban Pokok Penjualan (HPP) Aqua Botol',
        debit: 1260000,
        credit: 0,
        note: '30 Dus 600ml @ Rp 42.000 (Harga Beli)'
      },
      {
        accountCode: '1040',
        accountName: 'Persediaan Barang Dagang (Aqua Air Minum)',
        debit: 0,
        credit: 6860000,
        note: 'Pengurangan nilai persediaan gudang Denpasar'
      }
    ],
    totalDebit: 6860000,
    totalCredit: 6860000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  },
  {
    id: 'JRN-004',
    journalNumber: 'JRN-2026-004',
    date: '2026-11-18',
    referenceType: 'PAYMENT',
    referenceNumber: 'PMT-2026-001',
    description: 'Penerimaan pelunasan invoice INV-2026-002 dari Toko Berkah Jaya Mart',
    lines: [
      {
        accountCode: '1020',
        accountName: 'Bank Mandiri Distribusi (Operasional)',
        debit: 4500000,
        credit: 0,
        note: 'Setoran transfer masuk kliring Mandiri'
      },
      {
        accountCode: '1030',
        accountName: 'Piutang Usaha (Pelanggan)',
        debit: 0,
        credit: 4500000,
        note: 'Pelunasan piutang INV-2026-002'
      }
    ],
    totalDebit: 4500000,
    totalCredit: 4500000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  },
  {
    id: 'JRN-005',
    journalNumber: 'JRN-2026-005',
    date: '2026-11-19',
    referenceType: 'SO',
    referenceNumber: 'SO-2026-003',
    description: 'Penerimaan penjualan tunai COD Restoran Warung Sari Rasa Sanur (INV-2026-003)',
    lines: [
      {
        accountCode: '1010',
        accountName: 'Kas Operasional Denpasar',
        debit: 1000000,
        credit: 0,
        note: 'Penerimaan uang tunai dari pengemudi'
      },
      {
        accountCode: '4010',
        accountName: 'Pendapatan Penjualan Aqua Galon 19L',
        debit: 0,
        credit: 1000000,
        note: '50 Galon @ Rp 20.000'
      }
    ],
    totalDebit: 1000000,
    totalCredit: 1000000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  },
  {
    id: 'JRN-006',
    journalNumber: 'JRN-2026-006',
    date: '2026-11-20',
    referenceType: 'INV',
    referenceNumber: 'INV-2026-004',
    description: 'Pengakuan piutang penjualan SO-2026-004 ke CV Dewata Mitra Distribusi (JBR)',
    lines: [
      {
        accountCode: '1030',
        accountName: 'Piutang Usaha (Pelanggan)',
        debit: 7650000,
        credit: 0,
        note: 'Faktur INV-2026-004 TOP 21 Hari'
      },
      {
        accountCode: '4010',
        accountName: 'Pendapatan Penjualan Aqua Galon 19L',
        debit: 0,
        credit: 5000000,
        note: '250 Galon @ Rp 20.000'
      },
      {
        accountCode: '4020',
        accountName: 'Pendapatan Penjualan Aqua Botol',
        debit: 0,
        credit: 2650000,
        note: '50 Dus 1500ml @ Rp 53.000'
      }
    ],
    totalDebit: 7650000,
    totalCredit: 7650000,
    status: 'Posted',
    postedBy: 'Kadek Dwi Handayani, S.Ak.'
  }
]

export const mockCashBankTransactions: CashBankTransaction[] = [
  {
    id: 'TRX-001',
    trxNumber: 'CB-2026-001',
    date: '2026-11-12 11:00',
    accountCode: '1020',
    accountName: 'Bank Mandiri Distribusi',
    referenceNumber: 'PO-2026-001',
    description: 'Pembayaran uang muka DP pasokan pabrik Danone',
    type: 'KELUAR',
    amount: 5000000,
    runningBalance: 138000000,
    paymentMethod: 'Transfer Bank'
  },
  {
    id: 'TRX-002',
    trxNumber: 'CB-2026-002',
    date: '2026-11-15 15:30',
    accountCode: '1010',
    accountName: 'Kas Operasional Denpasar',
    referenceNumber: 'BBM-2026-011',
    description: 'Penggantian kupon solar 3 unit truk distribusi Denpasar',
    type: 'KELUAR',
    amount: 650000,
    runningBalance: 7450000,
    paymentMethod: 'Kas Tunai'
  },
  {
    id: 'TRX-003',
    trxNumber: 'CB-2026-003',
    date: '2026-11-18 10:20',
    accountCode: '1020',
    accountName: 'Bank Mandiri Distribusi',
    referenceNumber: 'INV-2026-002',
    description: 'Pelunasan transfer faktur Toko Berkah Jaya Mart',
    type: 'MASUK',
    amount: 4500000,
    runningBalance: 142500000,
    paymentMethod: 'Transfer Bank'
  },
  {
    id: 'TRX-004',
    trxNumber: 'CB-2026-004',
    date: '2026-11-19 16:30',
    accountCode: '1010',
    accountName: 'Kas Operasional Denpasar',
    referenceNumber: 'SO-2026-003',
    description: 'Penerimaan pembayaran COD Warung Sari Rasa Sanur',
    type: 'MASUK',
    amount: 1000000,
    runningBalance: 8450000,
    paymentMethod: 'Kas Tunai'
  },
  {
    id: 'TRX-005',
    trxNumber: 'CB-2026-005',
    date: '2026-11-21 14:00',
    accountCode: '1011',
    accountName: 'Kas Operasional Jimbaran',
    referenceNumber: 'SO-2026-005',
    description: 'Penerimaan penjualan tunai langsung loket Jimbaran',
    type: 'MASUK',
    amount: 100000,
    runningBalance: 5200000,
    paymentMethod: 'Kas Tunai'
  }
]

export const mockReceivables: ReceivableItem[] = [
  {
    id: 'AR-001',
    customerId: 'CUST-001',
    customerName: 'PT Bali Sunset Resort & Spa Hotel',
    customerCode: 'CST-001',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-11-14',
    dueDate: '2026-12-14',
    amount: 8500000,
    outstandingAmount: 8500000,
    status: 'Lancar',
    overdueDays: 0
  },
  {
    id: 'AR-002',
    customerId: 'CUST-004',
    customerName: 'CV Dewata Mitra Distribusi',
    customerCode: 'CST-004',
    invoiceNumber: 'INV-2026-004',
    invoiceDate: '2026-11-20',
    dueDate: '2026-12-11',
    amount: 7650000,
    outstandingAmount: 7650000,
    status: 'Lancar',
    overdueDays: 0
  }
]

export const mockPayables: PayableItem[] = [
  {
    id: 'AP-001',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    supplierCode: 'SPL-001',
    poNumber: 'PO-2026-001',
    billNumber: 'FB-DANONE-9821',
    billDate: '2026-11-12',
    dueDate: '2026-12-12',
    amount: 12200000,
    outstandingAmount: 7200000, // telah dibayar DP 5.000.000
    status: 'Lancar',
    overdueDays: 0
  },
  {
    id: 'AP-002',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    supplierCode: 'SPL-001',
    poNumber: 'PO-2026-002',
    billNumber: 'FB-DANONE-9844',
    billDate: '2026-11-16',
    dueDate: '2026-12-16',
    amount: 10000000,
    outstandingAmount: 10000000,
    status: 'Lancar',
    overdueDays: 0
  },
  {
    id: 'AP-003',
    supplierId: 'SUP-002',
    supplierName: 'CV Bali Tirta Sejahtera Mandiri',
    supplierCode: 'SPL-002',
    poNumber: 'PO-2026-003',
    billNumber: 'FB-BTSM-224',
    billDate: '2026-11-20',
    dueDate: '2026-12-05',
    amount: 9000000,
    outstandingAmount: 9000000,
    status: 'Lancar',
    overdueDays: 0
  }
]

