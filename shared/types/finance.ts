export type AccountCategory =
  | 'Aset Lancar'
  | 'Aset Tetap'
  | 'Kewajiban Lancar'
  | 'Kewajiban Jangka Panjang'
  | 'Ekuitas'
  | 'Pendapatan'
  | 'Beban Pokok Penjualan'
  | 'Beban Operasional'
  | 'Pendapatan / Beban Lainnya'

export interface ChartOfAccount {
  accountCode: string
  accountName: string
  category: AccountCategory
  normalBalance: 'Debit' | 'Kredit'
  balance: number
  description?: string
}

export interface JournalLine {
  accountCode: string
  accountName: string
  debit: number
  credit: number
  note?: string
}

export interface JournalEntry {
  id: string
  journalNumber: string
  date: string
  referenceType: 'PO' | 'GR' | 'SO' | 'DO' | 'INV' | 'PAYMENT' | 'ADJUSTMENT' | 'MANUAL'
  referenceNumber: string
  description: string
  lines: JournalLine[]
  totalDebit: number
  totalCredit: number
  status: 'Draft' | 'Posted' | 'Reversed'
  postedBy: string
}

export interface CashBankTransaction {
  id: string
  trxNumber: string
  date: string
  accountCode: string
  accountName: string
  referenceNumber: string
  description: string
  type: 'MASUK' | 'KELUAR'
  amount: number
  runningBalance: number
  paymentMethod: 'Transfer Bank' | 'Kas Tunai' | 'Giro / Cek'
}

export interface ReceivableItem {
  id: string
  customerId: string
  customerName: string
  customerCode: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amount: number
  outstandingAmount: number
  status: 'Lancar' | 'Jatuh Tempo' | 'Lunas'
  overdueDays: number
}

export interface PayableItem {
  id: string
  supplierId: string
  supplierName: string
  supplierCode: string
  poNumber: string
  billNumber: string
  billDate: string
  dueDate: string
  amount: number
  outstandingAmount: number
  status: 'Lancar' | 'Jatuh Tempo' | 'Lunas'
  overdueDays: number
}

