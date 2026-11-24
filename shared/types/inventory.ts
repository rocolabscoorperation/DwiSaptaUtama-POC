export type StockMovementType =
  | 'Penerimaan PO (GR)'
  | 'Pengiriman SO (DO)'
  | 'Penyesuaian Masuk (Opname)'
  | 'Penyesuaian Keluar (Rusak)'
  | 'Transfer Keluar'
  | 'Transfer Masuk'
  | 'Retur Pembelian'

export type StockStatus = 'Aman' | 'Menipis' | 'Kritis'

export interface StockItem {
  productId: string
  productName: string
  sku: string
  unit: string
  category: string
  depotId: string
  depotName: string
  quantity: number
  minStock: number
  purchasePrice: number
  stockValue: number
  status: StockStatus
}

export interface StockMovement {
  id: string
  movementNumber: string
  date: string
  type: StockMovementType
  referenceNumber: string
  productId: string
  productName: string
  sku: string
  unit: string
  depotId: string
  depotName: string
  qtyChange: number // positive or negative
  balanceAfter: number
  notes?: string
  operator: string
}

export interface StockAdjustment {
  id: string
  adjustmentNumber: string
  date: string
  depotId: string
  depotName: string
  productId: string
  productName: string
  sku: string
  systemQty: number
  physicalQty: number
  diffQty: number
  type: 'Adjustment In' | 'Adjustment Out'
  reason: string
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'
  adjustedBy: string
}

export interface StockTransfer {
  id: string
  transferNumber: string
  date: string
  sourceDepotId: string
  sourceDepotName: string
  targetDepotId: string
  targetDepotName: string
  items: {
    productId: string
    productName: string
    qty: number
    unit: string
  }[]
  status: 'Draft' | 'Dalam Transit' | 'Selesai' | 'Dibatalkan'
  driverName?: string
  vehicleNumber?: string
  notes?: string
}

