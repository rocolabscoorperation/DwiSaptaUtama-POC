export interface Product {
  id: string
  sku: string
  name: string
  category: 'Air Galon' | 'Air Botol' | 'Kemasan & Wadah'
  unit: string
  purchasePrice: number
  sellingPrice: number
  minStock: number
  status: 'ACTIVE' | 'INACTIVE'
  description?: string
}

export interface Supplier {
  id: string
  supplierCode: string
  name: string
  contactPerson: string
  phone: string
  email?: string
  address: string
  city: string
  status: 'ACTIVE' | 'INACTIVE'
}

export type CustomerType = 'Corporate' | 'Reseller' | 'Retail'
export type PaymentTerms = 'Cash (Tunai)' | 'Cash on Delivery (COD)' | 'TOP 14 Hari' | 'TOP 21 Hari' | 'TOP 30 Hari'

export interface Customer {
  id: string
  customerCode: string
  name: string
  type: CustomerType
  phone: string
  email?: string
  address: string
  city: string
  paymentTerms: PaymentTerms
  creditLimit: number
  status: 'ACTIVE' | 'INACTIVE'
}

