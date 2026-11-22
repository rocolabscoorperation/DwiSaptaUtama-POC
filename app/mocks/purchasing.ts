import type { PurchaseOrder, GoodsReceipt } from '~~/shared/types'

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-10',
    expectedDate: '2026-11-12',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qtyOrdered: 500,
        qtyReceived: 500,
        unitPrice: 16000,
        subtotal: 8000000
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        sku: 'AQ-BTL-600ML',
        unit: 'Karton (24 btl)',
        qtyOrdered: 100,
        qtyReceived: 100,
        unitPrice: 42000,
        subtotal: 4200000
      }
    ],
    totalAmount: 12200000,
    status: 'Selesai',
    notes: 'Pengiriman batch rutin awal bulan pabrik Mambal.'
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2026-002',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    orderDate: '2026-11-14',
    expectedDate: '2026-11-16',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qtyOrdered: 400,
        qtyReceived: 400,
        unitPrice: 16000,
        subtotal: 6400000
      },
      {
        productId: 'PROD-003',
        productName: 'Aqua 1500ml per Karton',
        sku: 'AQ-BTL-1500ML',
        unit: 'Karton (12 btl)',
        qtyOrdered: 80,
        qtyReceived: 80,
        unitPrice: 45000,
        subtotal: 3600000
      }
    ],
    totalAmount: 10000000,
    status: 'Selesai',
    notes: 'Pasokan Depot Jimbaran untuk kebutuhan hotel kawasan Nusa Dua & Uluwatu.'
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2026-003',
    supplierId: 'SUP-002',
    supplierName: 'CV Bali Tirta Sejahtera Mandiri',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-18',
    expectedDate: '2026-11-20',
    items: [
      {
        productId: 'PROD-004',
        productName: 'Galon Kosong 19 Liter',
        sku: 'AQ-GALON-EMPTY',
        unit: 'Galon',
        qtyOrdered: 300,
        qtyReceived: 200,
        unitPrice: 30000,
        subtotal: 9000000
      }
    ],
    totalAmount: 9000000,
    status: 'Sebagian Diterima',
    notes: 'Pengadaan galon baru sirkulasi depot Denpasar. 100 unit menyusul di batch 2.'
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2026-004',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-21',
    expectedDate: '2026-11-23',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qtyOrdered: 600,
        qtyReceived: 0,
        unitPrice: 16000,
        subtotal: 9600000
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        sku: 'AQ-BTL-600ML',
        unit: 'Karton (24 btl)',
        qtyOrdered: 150,
        qtyReceived: 0,
        unitPrice: 42000,
        subtotal: 6300000
      }
    ],
    totalAmount: 15900000,
    status: 'Disetujui',
    notes: 'Restock antisipasi lonjakan permintaan akhir pekan di Denpasar.'
  }
]

export const mockGoodsReceipts: GoodsReceipt[] = [
  {
    id: 'GR-001',
    grNumber: 'GR-2026-001',
    poNumber: 'PO-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    receiptDate: '2026-11-12',
    receivedBy: 'Ketut Gede Raka (Gudang DPS)',
    status: 'Diterima Penuh',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qtyReceived: 500,
        condition: 'Baik'
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        sku: 'AQ-BTL-600ML',
        unit: 'Karton (24 btl)',
        qtyReceived: 100,
        condition: 'Baik'
      }
    ],
    notes: 'Diterima lengkap dengan segel Danone utuh dan tanggal kedaluwarsa sesuai.'
  },
  {
    id: 'GR-002',
    grNumber: 'GR-2026-002',
    poNumber: 'PO-2026-002',
    supplierId: 'SUP-001',
    supplierName: 'PT Tirta Investama Danone Mambal',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    receiptDate: '2026-11-16',
    receivedBy: 'Ketut Sudarsana (Gudang JBR)',
    status: 'Diterima Penuh',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qtyReceived: 400,
        condition: 'Baik'
      },
      {
        productId: 'PROD-003',
        productName: 'Aqua 1500ml per Karton',
        sku: 'AQ-BTL-1500ML',
        unit: 'Karton (12 btl)',
        qtyReceived: 80,
        condition: 'Baik'
      }
    ],
    notes: 'Pemeriksaan fisik selesai. Segel tutup botol dalam kondisi standar pabrik.'
  },
  {
    id: 'GR-003',
    grNumber: 'GR-2026-003',
    poNumber: 'PO-2026-003',
    supplierId: 'SUP-002',
    supplierName: 'CV Bali Tirta Sejahtera Mandiri',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    receiptDate: '2026-11-20',
    receivedBy: 'Ketut Gede Raka (Gudang DPS)',
    status: 'Diterima Sebagian',
    items: [
      {
        productId: 'PROD-004',
        productName: 'Galon Kosong 19 Liter',
        sku: 'AQ-GALON-EMPTY',
        unit: 'Galon',
        qtyReceived: 200,
        condition: 'Baik'
      }
    ],
    notes: 'Pengiriman tahap pertama (200 dari 300 unit). Sisa 100 unit dijadwalkan 24 Nov 2026.'
  }
]

