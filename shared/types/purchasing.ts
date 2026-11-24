export type POStatus = 'Draft' | 'Diajukan' | 'Disetujui' | 'Sebagian Diterima' | 'Selesai' | 'Dibatalkan'
export type GRStatus = 'Draft' | 'Diterima Sebagian' | 'Diterima Penuh'
export type ReturnStatus = 'Diajukan' | 'Disetujui' | 'Selesai'

export interface POItem {
  productId: string
  productName: string
  sku: string
  unit: string
  qtyOrdered: number
  qtyReceived: number
  unitPrice: number
  subtotal: number
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  depotId: string
  depotName: string
  orderDate: string
  expectedDate: string
  items: POItem[]
  totalAmount: number
  status: POStatus
  notes?: string
}

export interface GRItem {
  productId: string
  productName: string
  sku: string
  unit: string
  qtyReceived: number
  condition: 'Baik' | 'Rusak/Cacat'
}

export interface GoodsReceipt {
  id: string
  grNumber: string
  poNumber: string
  supplierId: string
  supplierName: string
  depotId: string
  depotName: string
  receiptDate: string
  receivedBy: string
  items: GRItem[]
  status: GRStatus
  notes?: string
}

export interface GoodsReturn {
  id: string
  returnNumber: string
  grNumber: string
  poNumber: string
  supplierId: string
  supplierName: string
  depotId: string
  depotName: string
  returnDate: string
  returnedBy: string
  reason: string
  status: ReturnStatus
  items: {
    productId: string
    productName: string
    sku: string
    unit: string
    qtyReturned: number
  }[]
}

