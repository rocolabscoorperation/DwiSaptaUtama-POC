import type { Product } from '~~/shared/types'

export const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    sku: 'AQ-GALON-19L',
    name: 'Aqua Galon 19 Liter',
    category: 'Air Galon',
    unit: 'Galon',
    purchasePrice: 16000,
    sellingPrice: 20000,
    minStock: 200,
    status: 'ACTIVE',
    description: 'Air mineral Aqua kemasan galon 19 liter isi ulang resmi pabrik Danone Tirta Investama.'
  },
  {
    id: 'PROD-002',
    sku: 'AQ-BTL-600ML',
    name: 'Aqua 600ml per Karton',
    category: 'Air Botol',
    unit: 'Karton (24 btl)',
    purchasePrice: 42000,
    sellingPrice: 50000,
    minStock: 100,
    status: 'ACTIVE',
    description: 'Air mineral Aqua kemasan botol sedang 600ml per dus/karton isi 24 botol.'
  },
  {
    id: 'PROD-003',
    sku: 'AQ-BTL-1500ML',
    name: 'Aqua 1500ml per Karton',
    category: 'Air Botol',
    unit: 'Karton (12 btl)',
    purchasePrice: 45000,
    sellingPrice: 53000,
    minStock: 80,
    status: 'ACTIVE',
    description: 'Air mineral Aqua kemasan botol besar 1500ml per dus/karton isi 12 botol.'
  },
  {
    id: 'PROD-004',
    sku: 'AQ-GALON-EMPTY',
    name: 'Galon Kosong 19 Liter',
    category: 'Kemasan & Wadah',
    unit: 'Galon',
    purchasePrice: 30000,
    sellingPrice: 35000,
    minStock: 150,
    status: 'ACTIVE',
    description: 'Galon kosong polikarbonat resmi berlogo timbul Aqua untuk sistem sirkulasi wadah deposit.'
  }
]

