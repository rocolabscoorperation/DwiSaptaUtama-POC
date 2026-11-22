export type UserRole =
  | 'super_admin'
  | 'owner'
  | 'admin_depot'
  | 'purchasing_staff'
  | 'warehouse_staff'
  | 'sales_staff'
  | 'finance_staff'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  roleName: string
  depotIds: string[] // 'ALL' or specific depot IDs like 'DEP-001'
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE'
  phone?: string
}

export interface Depot {
  id: string
  code: string
  name: string
  address: string
  phone: string
  manager: string
  status: 'ACTIVE' | 'INACTIVE'
}

