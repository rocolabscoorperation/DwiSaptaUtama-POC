import type { StockItem, StockMovement, StockAdjustment, StockTransfer } from '~~/shared/types'

export const mockStockItems: StockItem[] = [
  // Depot Denpasar (DEP-001)
  {
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    category: 'Air Galon',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    quantity: 480,
    minStock: 200,
    purchasePrice: 16000,
    stockValue: 7680000,
    status: 'Aman'
  },
  {
    productId: 'PROD-002',
    productName: 'Aqua 600ml per Karton',
    sku: 'AQ-BTL-600ML',
    unit: 'Karton (24 btl)',
    category: 'Air Botol',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    quantity: 145,
    minStock: 100,
    purchasePrice: 42000,
    stockValue: 6090000,
    status: 'Aman'
  },
  {
    productId: 'PROD-003',
    productName: 'Aqua 1500ml per Karton',
    sku: 'AQ-BTL-1500ML',
    unit: 'Karton (12 btl)',
    category: 'Air Botol',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    quantity: 65,
    minStock: 80,
    purchasePrice: 45000,
    stockValue: 2925000,
    status: 'Menipis'
  },
  {
    productId: 'PROD-004',
    productName: 'Galon Kosong 19 Liter',
    sku: 'AQ-GALON-EMPTY',
    unit: 'Galon',
    category: 'Kemasan & Wadah',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    quantity: 310,
    minStock: 150,
    purchasePrice: 30000,
    stockValue: 9300000,
    status: 'Aman'
  },

  // Depot Jimbaran (DEP-002)
  {
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    category: 'Air Galon',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    quantity: 320,
    minStock: 200,
    purchasePrice: 16000,
    stockValue: 5120000,
    status: 'Aman'
  },
  {
    productId: 'PROD-002',
    productName: 'Aqua 600ml per Karton',
    sku: 'AQ-BTL-600ML',
    unit: 'Karton (24 btl)',
    category: 'Air Botol',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    quantity: 75,
    minStock: 100,
    purchasePrice: 42000,
    stockValue: 3150000,
    status: 'Menipis'
  },
  {
    productId: 'PROD-003',
    productName: 'Aqua 1500ml per Karton',
    sku: 'AQ-BTL-1500ML',
    unit: 'Karton (12 btl)',
    category: 'Air Botol',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    quantity: 95,
    minStock: 80,
    purchasePrice: 45000,
    stockValue: 4275000,
    status: 'Aman'
  },
  {
    productId: 'PROD-004',
    productName: 'Galon Kosong 19 Liter',
    sku: 'AQ-GALON-EMPTY',
    unit: 'Galon',
    category: 'Kemasan & Wadah',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    quantity: 180,
    minStock: 150,
    purchasePrice: 30000,
    stockValue: 5400000,
    status: 'Aman'
  }
]

export const mockStockMovements: StockMovement[] = [
  {
    id: 'MOV-001',
    movementNumber: 'MOV-2026-001',
    date: '2026-11-12 10:15',
    type: 'Penerimaan PO (GR)',
    referenceNumber: 'GR-2026-001',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    qtyChange: 500,
    balanceAfter: 735,
    notes: 'Penerimaan barang dari pabrik Danone Mambal PO-2026-001',
    operator: 'Ketut Gede Raka'
  },
  {
    id: 'MOV-002',
    movementNumber: 'MOV-2026-002',
    date: '2026-11-14 14:30',
    type: 'Pengiriman SO (DO)',
    referenceNumber: 'DO-2026-001',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    qtyChange: -350,
    balanceAfter: 385,
    notes: 'Pengiriman armada ke PT Bali Sunset Resort SO-2026-001',
    operator: 'Ketut Gede Raka'
  },
  {
    id: 'MOV-003',
    movementNumber: 'MOV-2026-003',
    date: '2026-11-15 09:00',
    type: 'Penyesuaian Keluar (Rusak)',
    referenceNumber: 'ADJ-2026-001',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    qtyChange: -5,
    balanceAfter: 380,
    notes: 'Segel rusak bocor saat bongkar muat opname',
    operator: 'Ketut Gede Raka'
  },
  {
    id: 'MOV-004',
    movementNumber: 'MOV-2026-004',
    date: '2026-11-16 11:20',
    type: 'Penerimaan PO (GR)',
    referenceNumber: 'GR-2026-002',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    qtyChange: 400,
    balanceAfter: 470,
    notes: 'Penerimaan pasokan pabrik PO-2026-002',
    operator: 'Ketut Sudarsana'
  },
  {
    id: 'MOV-005',
    movementNumber: 'MOV-2026-005',
    date: '2026-11-18 16:45',
    type: 'Transfer Masuk',
    referenceNumber: 'TRF-2026-001',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    qtyChange: 100,
    balanceAfter: 570,
    notes: 'Penerimaan transfer stok antar depot dari Denpasar TRF-2026-001',
    operator: 'Ketut Sudarsana'
  },
  {
    id: 'MOV-006',
    movementNumber: 'MOV-2026-006',
    date: '2026-11-20 15:10',
    type: 'Pengiriman SO (DO)',
    referenceNumber: 'DO-2026-004',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    unit: 'Galon',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    qtyChange: -250,
    balanceAfter: 320,
    notes: 'Pengiriman ke CV Dewata Mitra SO-2026-004',
    operator: 'Ketut Sudarsana'
  }
]

export const mockStockAdjustments: StockAdjustment[] = [
  {
    id: 'ADJ-001',
    adjustmentNumber: 'ADJ-2026-001',
    date: '2026-11-15',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    productId: 'PROD-001',
    productName: 'Aqua Galon 19 Liter',
    sku: 'AQ-GALON-19L',
    systemQty: 385,
    physicalQty: 380,
    diffQty: -5,
    type: 'Adjustment Out',
    reason: 'Segel leher galon robek dan bocor saat bongkar muat di gudang barat.',
    status: 'Disetujui',
    adjustedBy: 'Ketut Gede Raka (Disetujui: Wayan Suryawan)'
  },
  {
    id: 'ADJ-002',
    adjustmentNumber: 'ADJ-2026-002',
    date: '2026-11-17',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    productId: 'PROD-004',
    productName: 'Galon Kosong 19 Liter',
    sku: 'AQ-GALON-EMPTY',
    systemQty: 170,
    physicalQty: 180,
    diffQty: 10,
    type: 'Adjustment In',
    reason: 'Temuan fisik galon kosong berlebih saat opname mingguan palet belakang.',
    status: 'Disetujui',
    adjustedBy: 'Ketut Sudarsana (Disetujui: Ir. H. Gunawan)'
  }
]

export const mockStockTransfers: StockTransfer[] = [
  {
    id: 'TRF-001',
    transferNumber: 'TRF-2026-001',
    date: '2026-11-18',
    sourceDepotId: 'DEP-001',
    sourceDepotName: 'Depot Denpasar',
    targetDepotId: 'DEP-002',
    targetDepotName: 'Depot Jimbaran',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        qty: 100,
        unit: 'Galon'
      },
      {
        productId: 'PROD-003',
        productName: 'Aqua 1500ml per Karton',
        qty: 30,
        unit: 'Karton (12 btl)'
      }
    ],
    status: 'Selesai',
    driverName: 'I Made Budiana',
    vehicleNumber: 'DK 8145 EF',
    notes: 'Transfer penyeimbangan stok antar depot telah diterima lengkap di Jimbaran.'
  },
  {
    id: 'TRF-002',
    transferNumber: 'TRF-2026-002',
    date: '2026-11-21',
    sourceDepotId: 'DEP-002',
    sourceDepotName: 'Depot Jimbaran',
    targetDepotId: 'DEP-001',
    targetDepotName: 'Depot Denpasar',
    items: [
      {
        productId: 'PROD-004',
        productName: 'Galon Kosong 19 Liter',
        qty: 50,
        unit: 'Galon'
      }
    ],
    status: 'Dalam Transit',
    driverName: 'I Wayan Agus',
    vehicleNumber: 'DK 7120 CD',
    notes: 'Pengiriman galon kosong surplus dari Jimbaran untuk rotasi pengisian ulang Denpasar.'
  }
]

