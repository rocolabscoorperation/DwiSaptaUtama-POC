export type SOStatus = 'Draft' | 'Dikonfirmasi' | 'Diproses' | 'Terkirim' | 'Selesai & Lunas' | 'Dibatalkan'
export type DOStatus = 'Draft' | 'Siap Dikirim' | 'Dalam Pengiriman' | 'Terkirim & Diterima' | 'Gagal Kirim'
export type InvoiceStatus = 'Belum Dibayar' | 'Sebagian Dibayar' | 'Lunas' | 'Jatuh Tempo'

export interface SOItem {
  productId: string
  productName: string
  sku: string
  unit: string
  qty: number
  unitPrice: number
  subtotal: number
}

export interface SalesOrder {
  id: string
  soNumber: string
  customerId: string
  customerName: string
  customerType: string
  depotId: string
  depotName: string
  orderDate: string
  deliveryDate?: string
  paymentType: 'Tunai (COD)' | 'Tunai' | 'Kredit (TOP 14)' | 'Kredit (TOP 21)' | 'Kredit (TOP 30)'
  items: SOItem[]
  totalAmount: number
  status: SOStatus
  notes?: string
}

export interface DeliveryOrder {
  id: string
  doNumber: string
  soNumber: string
  customerId: string
  customerName: string
  customerAddress: string
  depotId: string
  depotName: string
  deliveryDate: string
  driverName: string
  vehiclePlate: string
  items: {
    productId: string
    productName: string
    qty: number
    unit: string
  }[]
  status: DOStatus
  recipientName?: string
  receivedTime?: string
  notes?: string
}

export interface SalesInvoice {
  id: string
  invoiceNumber: string
  soNumber: string
  doNumber: string
  customerId: string
  customerName: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  status: InvoiceStatus
  paymentMethod?: string
}

