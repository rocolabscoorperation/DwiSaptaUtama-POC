import type { User } from '~~/shared/types'

export interface DemoAccount extends User {
  password: string
}

export const mockUsers: DemoAccount[] = [
  {
    id: 'USR-001',
    name: 'Bagus Pratama (Super Admin)',
    email: 'superadmin@demo.com',
    password: 'demo123',
    role: 'super_admin',
    roleName: 'Super Admin',
    depotIds: ['DEP-001', 'DEP-002'],
    status: 'ACTIVE',
    phone: '0812-3456-0001'
  },
  {
    id: 'USR-002',
    name: 'Ir. H. Gunawan (Owner)',
    email: 'owner@demo.com',
    password: 'demo123',
    role: 'owner',
    roleName: 'Owner / Management',
    depotIds: ['DEP-001', 'DEP-002'],
    status: 'ACTIVE',
    phone: '0811-9876-0002'
  },
  {
    id: 'USR-003',
    name: 'Wayan Suryawan (Admin Depot DPS)',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin_depot',
    roleName: 'Admin Depot',
    depotIds: ['DEP-001'],
    status: 'ACTIVE',
    phone: '0813-2233-0003'
  },
  {
    id: 'USR-004',
    name: 'Ni Made Dewi (Purchasing)',
    email: 'purchasing@demo.com',
    password: 'demo123',
    role: 'purchasing_staff',
    roleName: 'Purchasing Staff',
    depotIds: ['DEP-001', 'DEP-002'],
    status: 'ACTIVE',
    phone: '0817-4455-0004'
  },
  {
    id: 'USR-005',
    name: 'Ketut Gede Raka (Gudang DPS)',
    email: 'warehouse@demo.com',
    password: 'demo123',
    role: 'warehouse_staff',
    roleName: 'Warehouse Staff',
    depotIds: ['DEP-001'],
    status: 'ACTIVE',
    phone: '0818-6677-0005'
  },
  {
    id: 'USR-006',
    name: 'Gusti Ayu Lestari (Sales)',
    email: 'sales@demo.com',
    password: 'demo123',
    role: 'sales_staff',
    roleName: 'Sales Staff',
    depotIds: ['DEP-001', 'DEP-002'],
    status: 'ACTIVE',
    phone: '0819-8899-0006'
  },
  {
    id: 'USR-007',
    name: 'Kadek Dwi Handayani, S.Ak. (Finance)',
    email: 'finance@demo.com',
    password: 'demo123',
    role: 'finance_staff',
    roleName: 'Finance Staff',
    depotIds: ['DEP-001', 'DEP-002'],
    status: 'ACTIVE',
    phone: '0812-7788-0007'
  }
]

