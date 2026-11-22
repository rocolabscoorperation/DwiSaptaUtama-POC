import type { Supplier } from '~~/shared/types'

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    supplierCode: 'SPL-001',
    name: 'PT Tirta Investama Danone Mambal',
    contactPerson: 'Ir. I Nyoman Suardana',
    phone: '(0361) 461234',
    email: 'distribution.bali@danone.com',
    address: 'Kawasan Pabrik Danone Mambal, Jl. Raya Mambal No. 12, Abiansemal, Badung',
    city: 'Badung, Bali',
    status: 'ACTIVE'
  },
  {
    id: 'SUP-002',
    supplierCode: 'SPL-002',
    name: 'CV Bali Tirta Sejahtera Mandiri',
    contactPerson: 'Made Sudarma Wijaya',
    phone: '(0361) 728192',
    email: 'info@balitirtasejahtera.co.id',
    address: 'Kawasan Pergudangan Candi Kuning No. 8, Baturiti, Tabanan',
    city: 'Tabanan, Bali',
    status: 'ACTIVE'
  }
]

