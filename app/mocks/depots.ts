import type { Depot } from '~~/shared/types'

export const mockDepots: Depot[] = [
  {
    id: 'DEP-001',
    code: 'DPS-01',
    name: 'Depot Denpasar',
    address: 'Jl. Teuku Umar Barat No. 88, Pemecutan Klod, Denpasar Barat, Denpasar, Bali 80119',
    phone: '(0361) 234567',
    manager: 'Wayan Suryawan, S.E.',
    status: 'ACTIVE'
  },
  {
    id: 'DEP-002',
    code: 'JBR-01',
    name: 'Depot Jimbaran',
    address: 'Jl. Raya Uluwatu No. 45, Jimbaran, Kec. Kuta Selatan, Kab. Badung, Bali 80361',
    phone: '(0361) 891234',
    manager: 'Ketut Sudarsana',
    status: 'ACTIVE'
  }
]

