import type { Customer } from '~~/shared/types'

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    customerCode: 'CST-001',
    name: 'PT Bali Sunset Resort & Spa Hotel',
    type: 'Corporate',
    phone: '(0361) 754890',
    email: 'purchasing@balisunsetresort.com',
    address: 'Jl. Pantai Kuta No. 10, Kuta, Badung, Bali',
    city: 'Badung',
    paymentTerms: 'TOP 30 Hari',
    creditLimit: 25000000,
    status: 'ACTIVE'
  },
  {
    id: 'CUST-002',
    customerCode: 'CST-002',
    name: 'Toko Berkah Jaya Mart (Grosir)',
    type: 'Reseller',
    phone: '0812-3456-7890',
    email: 'berkahjaya.mart@gmail.com',
    address: 'Jl. Raya Sesetan No. 102, Denpasar Selatan, Denpasar',
    city: 'Denpasar',
    paymentTerms: 'TOP 14 Hari',
    creditLimit: 10000000,
    status: 'ACTIVE'
  },
  {
    id: 'CUST-003',
    customerCode: 'CST-003',
    name: 'Restoran Warung Sari Rasa Sanur',
    type: 'Retail',
    phone: '0813-9876-5432',
    email: 'sarirasa.sanur@yahoo.com',
    address: 'Jl. Bypass Ngurah Rai No. 230, Sanur Kauh, Denpasar Selatan',
    city: 'Denpasar',
    paymentTerms: 'Cash on Delivery (COD)',
    creditLimit: 0,
    status: 'ACTIVE'
  },
  {
    id: 'CUST-004',
    customerCode: 'CST-004',
    name: 'CV Dewata Mitra Distribusi',
    type: 'Reseller',
    phone: '(0361) 224466',
    email: 'dewatamitra.dist@gmail.com',
    address: 'Jl. Gatot Subroto Timur No. 55, Kesiman Petilan, Denpasar Timur',
    city: 'Denpasar',
    paymentTerms: 'TOP 21 Hari',
    creditLimit: 30000000,
    status: 'ACTIVE'
  },
  {
    id: 'CUST-005',
    customerCode: 'CST-005',
    name: 'Ibu Komang Suartini (Rumah Tangga)',
    type: 'Retail',
    phone: '0819-1122-3344',
    address: 'Perumahan Nuansa Jimbaran Indah Blok C/12, Jimbaran, Badung',
    city: 'Badung',
    paymentTerms: 'Cash (Tunai)',
    creditLimit: 0,
    status: 'ACTIVE'
  }
]

