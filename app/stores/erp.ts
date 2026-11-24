import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Product,
  Supplier,
  Customer,
  PurchaseOrder,
  StockAdjustment,
  StockTransfer,
  StockItem,
  StockMovement,
  SalesOrder,
  ChartOfAccount,
  JournalEntry,
  GoodsReceipt,
  GoodsReturn
} from '~~/shared/types'
import {
  mockProducts,
  mockSuppliers,
  mockCustomers,
  mockPurchaseOrders,
  mockGoodsReceipts,
  mockStockItems,
  mockStockMovements,
  mockStockAdjustments,
  mockStockTransfers,
  mockSalesOrders,
  mockDeliveryOrders,
  mockSalesInvoices,
  mockChartOfAccounts,
  mockJournalEntries,
  mockCashBankTransactions,
  mockReceivables,
  mockPayables
} from '~/mocks'
import { useDepotStore } from './depot'

export const useErpStore = defineStore('erp', () => {
  const depotStore = useDepotStore()

  // Master Data
  const products = ref<Product[]>([...mockProducts])
  const suppliers = ref<Supplier[]>([...mockSuppliers])
  const customers = ref<Customer[]>([...mockCustomers])

  // Purchasing
  const purchaseOrders = ref<PurchaseOrder[]>([...mockPurchaseOrders])
  const goodsReceipts = ref<GoodsReceipt[]>([...mockGoodsReceipts])
  const goodsReturns = ref<GoodsReturn[]>([])

  // Inventory
  const stockItems = ref([...mockStockItems])
  const stockMovements = ref([...mockStockMovements])
  const stockAdjustments = ref<StockAdjustment[]>([...mockStockAdjustments])
  const stockTransfers = ref<StockTransfer[]>([...mockStockTransfers])

  // Sales
  const salesOrders = ref<SalesOrder[]>([...mockSalesOrders])
  const deliveryOrders = ref([...mockDeliveryOrders])
  const salesInvoices = ref([...mockSalesInvoices])

  // Finance
  const chartOfAccounts = ref<ChartOfAccount[]>([...mockChartOfAccounts])
  const journalEntries = ref<JournalEntry[]>([...mockJournalEntries])
  const cashBankTransactions = ref([...mockCashBankTransactions])
  const receivables = ref([...mockReceivables])
  const payables = ref([...mockPayables])

  // Depot-filtered getters
  const activeDepotId = computed(() => depotStore.selectedDepotId)

  // Filtered Stock Items
  const filteredStock = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return stockItems.value
    }
    return stockItems.value.filter((item) => item.depotId === activeDepotId.value)
  })

  // Filtered Purchase Orders
  const filteredPurchaseOrders = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return purchaseOrders.value
    }
    return purchaseOrders.value.filter((po) => po.depotId === activeDepotId.value)
  })

  // Filtered Goods Receipts
  const filteredGoodsReceipts = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return goodsReceipts.value
    }
    return goodsReceipts.value.filter((gr) => gr.depotId === activeDepotId.value)
  })

  const filteredGoodsReturns = computed(() => {
    if (activeDepotId.value === 'ALL') return goodsReturns.value
    return goodsReturns.value.filter((item: GoodsReturn) => item.depotId === activeDepotId.value)
  })

  // Filtered Sales Orders
  const filteredSalesOrders = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return salesOrders.value
    }
    return salesOrders.value.filter((so) => so.depotId === activeDepotId.value)
  })

  // Filtered Delivery Orders
  const filteredDeliveryOrders = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return deliveryOrders.value
    }
    return deliveryOrders.value.filter((doItem) => doItem.depotId === activeDepotId.value)
  })

  // Filtered Invoices (matched via SO depot)
  const filteredSalesInvoices = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return salesInvoices.value
    }
    // find related SO depot
    const depotSoNumbers = new Set(
      salesOrders.value
        .filter((so) => so.depotId === activeDepotId.value)
        .map((so) => so.soNumber)
    )
    return salesInvoices.value.filter((inv) => depotSoNumbers.has(inv.soNumber))
  })

  // Filtered Movements
  const filteredStockMovements = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return stockMovements.value
    }
    return stockMovements.value.filter((mov) => mov.depotId === activeDepotId.value)
  })

  // Filtered Adjustments
  const filteredStockAdjustments = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return stockAdjustments.value
    }
    return stockAdjustments.value.filter((adj) => adj.depotId === activeDepotId.value)
  })

  // Filtered Transfers
  const filteredStockTransfers = computed(() => {
    if (activeDepotId.value === 'ALL') {
      return stockTransfers.value
    }
    return stockTransfers.value.filter(
      (trf) => trf.sourceDepotId === activeDepotId.value || trf.targetDepotId === activeDepotId.value
    )
  })

  // Dynamic Dashboard Metrics
  const dashboardMetrics = computed(() => {
    // Total Sales
    const totalSales = filteredSalesOrders.value.reduce((acc, so) => acc + so.totalAmount, 0)

    // Total Purchases
    const totalPurchases = filteredPurchaseOrders.value.reduce((acc, po) => acc + po.totalAmount, 0)

    // Inventory Value
    const inventoryValue = filteredStock.value.reduce((acc, item) => acc + item.stockValue, 0)

    // Receivables (AR)
    const totalReceivables = filteredSalesInvoices.value.reduce(
      (acc, inv) => acc + inv.outstandingAmount,
      0
    )

    // Payables (AP)
    let totalPayables = 0
    if (activeDepotId.value === 'ALL') {
      totalPayables = payables.value.reduce((acc, p) => acc + p.outstandingAmount, 0)
    } else {
      const depotPoNumbers = new Set(
        filteredPurchaseOrders.value.map((po) => po.poNumber)
      )
      totalPayables = payables.value
        .filter((p) => depotPoNumbers.has(p.poNumber))
        .reduce((acc, p) => acc + p.outstandingAmount, 0)
    }

    // Active Customers count
    const activeCustomersCount = customers.value.filter((c) => c.status === 'ACTIVE').length

    // Low stock count
    const lowStockCount = filteredStock.value.filter(
      (item) => item.status === 'Menipis' || item.status === 'Kritis'
    ).length

    return {
      totalSales,
      totalPurchases,
      inventoryValue,
      totalReceivables,
      totalPayables,
      activeCustomersCount,
      lowStockCount
    }
  })

  // Low stock alert items
  const lowStockAlerts = computed(() => {
    return filteredStock.value.filter(
      (item) => item.quantity <= item.minStock || item.status === 'Menipis'
    )
  })

  // Recent Sales (top 5)
  const recentSales = computed(() => {
    return [...filteredSalesOrders.value]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5)
  })

  // Recent Purchase Orders (top 5)
  const recentPurchaseOrders = computed(() => {
    return [...filteredPurchaseOrders.value]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5)
  })

  // Outstanding Invoices
  const outstandingInvoices = computed(() => {
    return filteredSalesInvoices.value.filter((inv) => inv.outstandingAmount > 0)
  })

  // ==========================================
  // CRUD OPERATIONS: PRODUCTS
  // ==========================================
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newId = `PROD-${String(products.value.length + 1).padStart(3, '0')}`
    const newProduct: Product = { ...prod, id: newId }
    products.value.push(newProduct)

    // Also seed into stock overview for both depots
    stockItems.value.push({
      productId: newId,
      productName: newProduct.name,
      sku: newProduct.sku,
      unit: newProduct.unit,
      category: newProduct.category,
      depotId: 'DEP-001',
      depotName: 'Depot Denpasar',
      quantity: 0,
      minStock: newProduct.minStock,
      purchasePrice: newProduct.purchasePrice,
      stockValue: 0,
      status: 'Kritis'
    })

    stockItems.value.push({
      productId: newId,
      productName: newProduct.name,
      sku: newProduct.sku,
      unit: newProduct.unit,
      category: newProduct.category,
      depotId: 'DEP-002',
      depotName: 'Depot Jimbaran',
      quantity: 0,
      minStock: newProduct.minStock,
      purchasePrice: newProduct.purchasePrice,
      stockValue: 0,
      status: 'Kritis'
    })

    return newProduct
  }

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updated }
      // Update in stockItems as well
      stockItems.value.forEach((item) => {
        if (item.productId === id) {
          if (updated.name) item.productName = updated.name
          if (updated.sku) item.sku = updated.sku
          if (updated.unit) item.unit = updated.unit
          if (updated.category) item.category = updated.category
          if (updated.purchasePrice !== undefined) {
            item.purchasePrice = updated.purchasePrice
            item.stockValue = item.quantity * updated.purchasePrice
          }
          if (updated.minStock !== undefined) {
            item.minStock = updated.minStock
            item.status = item.quantity <= 0 ? 'Kritis' : (item.quantity <= updated.minStock ? 'Menipis' : 'Aman')
          }
        }
      })
    }
  }

  const deleteProduct = (id: string) => {
    products.value = products.value.filter((p) => p.id !== id)
    stockItems.value = stockItems.value.filter((item) => item.productId !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: CUSTOMERS
  // ==========================================
  const addCustomer = (cust: Omit<Customer, 'id'>) => {
    const newId = `CUST-${String(customers.value.length + 1).padStart(3, '0')}`
    const newCustomer: Customer = { ...cust, id: newId }
    customers.value.push(newCustomer)
    return newCustomer
  }

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    const idx = customers.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      customers.value[idx] = { ...customers.value[idx], ...updated }
    }
  }

  const deleteCustomer = (id: string) => {
    customers.value = customers.value.filter((c) => c.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: SUPPLIERS
  // ==========================================
  const addSupplier = (sup: Omit<Supplier, 'id'>) => {
    const newId = `SUP-${String(suppliers.value.length + 1).padStart(3, '0')}`
    const newSupplier: Supplier = { ...sup, id: newId }
    suppliers.value.push(newSupplier)
    return newSupplier
  }

  const updateSupplier = (id: string, updated: Partial<Supplier>) => {
    const idx = suppliers.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      suppliers.value[idx] = { ...suppliers.value[idx], ...updated }
    }
  }

  const deleteSupplier = (id: string) => {
    suppliers.value = suppliers.value.filter((s) => s.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: PURCHASE ORDERS
  // ==========================================
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const num = String(purchaseOrders.value.length + 1).padStart(3, '0')
    const newPo: PurchaseOrder = {
      ...poData,
      id: `PO-${num}`,
      poNumber: `PO-2026-${num}`
    }
    purchaseOrders.value.unshift(newPo)
    return newPo
  }

  const updatePurchaseOrder = (id: string, updated: Partial<PurchaseOrder>) => {
    const idx = purchaseOrders.value.findIndex((po) => po.id === id)
    if (idx !== -1) {
      purchaseOrders.value[idx] = { ...purchaseOrders.value[idx], ...updated }
    }
  }

  const deletePurchaseOrder = (id: string) => {
    purchaseOrders.value = purchaseOrders.value.filter((po) => po.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: GOODS RECEIPTS / RETURNS
  // ==========================================
  const addGoodsReceipt = (data: Omit<GoodsReceipt, 'id' | 'grNumber'>) => {
    const num = String(goodsReceipts.value.length + 1).padStart(3, '0')
    const receipt: GoodsReceipt = { ...data, id: `GR-${num}`, grNumber: `GR-2026-${num}` }
    goodsReceipts.value.unshift(receipt)

    const po = purchaseOrders.value.find((item: PurchaseOrder) => item.poNumber === data.poNumber)
    if (po) {
      po.items = po.items.map((poItem: PurchaseOrder['items'][number]) => {
        const received = data.items.find((item: GoodsReceipt['items'][number]) => item.productId === poItem.productId)?.qtyReceived || 0
        return { ...poItem, qtyReceived: Math.min(poItem.qtyOrdered, poItem.qtyReceived + received) }
      })
      const receivedTotal = po.items.reduce((sum: number, item: PurchaseOrder['items'][number]) => sum + item.qtyReceived, 0)
      const orderedTotal = po.items.reduce((sum: number, item: PurchaseOrder['items'][number]) => sum + item.qtyOrdered, 0)
      po.status = receivedTotal >= orderedTotal ? 'Selesai' : 'Sebagian Diterima'
    }

    data.items.forEach((item: GoodsReceipt['items'][number]) => {
      const stock = stockItems.value.find((stockItem: StockItem) => stockItem.depotId === data.depotId && stockItem.productId === item.productId)
      if (!stock) return
      stock.quantity += item.qtyReceived
      stock.stockValue = stock.quantity * stock.purchasePrice
      stock.status = stock.quantity <= 0 ? 'Kritis' : stock.quantity <= stock.minStock ? 'Menipis' : 'Aman'
      const movementNum = String(stockMovements.value.length + 1).padStart(3, '0')
      stockMovements.value.unshift({
        id: `MOV-${movementNum}`, movementNumber: `MOV-2026-${movementNum}`,
        date: `${data.receiptDate} 09:00`, type: 'Penerimaan PO (GR)', referenceNumber: receipt.grNumber,
        productId: item.productId, productName: item.productName, sku: item.sku, unit: item.unit,
        depotId: data.depotId, depotName: data.depotName, qtyChange: item.qtyReceived,
        balanceAfter: stock.quantity, notes: `Penerimaan barang dari PO ${data.poNumber}`, operator: data.receivedBy
      })
    })
    return receipt
  }

  const addGoodsReturn = (data: Omit<GoodsReturn, 'id' | 'returnNumber'>) => {
    const num = String(goodsReturns.value.length + 1).padStart(3, '0')
    const item: GoodsReturn = { ...data, id: `RET-${num}`, returnNumber: `RET-2026-${num}` }
    goodsReturns.value.unshift(item)
    data.items.forEach((returnItem: GoodsReturn['items'][number]) => {
      const stock = stockItems.value.find((stockItem: StockItem) => stockItem.depotId === data.depotId && stockItem.productId === returnItem.productId)
      if (!stock) return
      const qtyReturned = Math.min(returnItem.qtyReturned, stock.quantity)
      stock.quantity = Math.max(0, stock.quantity - qtyReturned)
      stock.stockValue = stock.quantity * stock.purchasePrice
      stock.status = stock.quantity <= 0 ? 'Kritis' : stock.quantity <= stock.minStock ? 'Menipis' : 'Aman'
      const movementNum = String(stockMovements.value.length + 1).padStart(3, '0')
      stockMovements.value.unshift({
        id: `MOV-${movementNum}`, movementNumber: `MOV-2026-${movementNum}`,
        date: `${data.returnDate} 09:00`, type: 'Retur Pembelian', referenceNumber: item.returnNumber,
        productId: returnItem.productId, productName: returnItem.productName, sku: returnItem.sku, unit: returnItem.unit,
        depotId: data.depotId, depotName: data.depotName, qtyChange: -qtyReturned,
        balanceAfter: stock.quantity, notes: data.reason, operator: data.returnedBy
      })
    })
    return item
  }

  // ==========================================
  // CRUD OPERATIONS: STOCK ADJUSTMENTS
  // ==========================================
  const addStockAdjustment = (adjData: Omit<StockAdjustment, 'id' | 'adjustmentNumber'>) => {
    const num = String(stockAdjustments.value.length + 1).padStart(3, '0')
    const newAdj: StockAdjustment = {
      ...adjData,
      id: `ADJ-${num}`,
      adjustmentNumber: `ADJ-2026-${num}`
    }
    stockAdjustments.value.unshift(newAdj)

    // Adjust the physical stock item
    const targetItem = stockItems.value.find(
      (item) => item.depotId === adjData.depotId && item.productId === adjData.productId
    )
    if (targetItem) {
      targetItem.quantity = adjData.physicalQty
      targetItem.stockValue = targetItem.quantity * targetItem.purchasePrice
      targetItem.status = targetItem.quantity <= 0 ? 'Kritis' : (targetItem.quantity <= targetItem.minStock ? 'Menipis' : 'Aman')
    }

    return newAdj
  }

  const deleteStockAdjustment = (id: string) => {
    stockAdjustments.value = stockAdjustments.value.filter((adj) => adj.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: STOCK TRANSFERS
  // ==========================================
  const addStockTransfer = (trfData: Omit<StockTransfer, 'id' | 'transferNumber'>) => {
    const num = String(stockTransfers.value.length + 1).padStart(3, '0')
    const newTrf: StockTransfer = {
      ...trfData,
      id: `TRF-${num}`,
      transferNumber: `TRF-2026-${num}`
    }
    stockTransfers.value.unshift(newTrf)
    return newTrf
  }

  const deleteStockTransfer = (id: string) => {
    stockTransfers.value = stockTransfers.value.filter((trf) => trf.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: SALES ORDERS
  // ==========================================
  const addSalesOrder = (soData: Omit<SalesOrder, 'id' | 'soNumber'>) => {
    const num = String(salesOrders.value.length + 1).padStart(3, '0')
    const newSo: SalesOrder = {
      ...soData,
      id: `SO-${num}`,
      soNumber: `SO-2026-${num}`
    }
    salesOrders.value.unshift(newSo)

    // Auto-create Invoice if delivered or confirmed
    const invNum = `INV-2026-${num}`
    salesInvoices.value.unshift({
      id: `INV-${num}`,
      invoiceNumber: invNum,
      soNumber: newSo.soNumber,
      doNumber: `DO-2026-${num}`,
      customerId: newSo.customerId,
      customerName: newSo.customerName,
      invoiceDate: newSo.orderDate,
      dueDate: newSo.orderDate,
      totalAmount: newSo.totalAmount,
      paidAmount: newSo.paymentType.includes('Tunai') ? newSo.totalAmount : 0,
      outstandingAmount: newSo.paymentType.includes('Tunai') ? 0 : newSo.totalAmount,
      status: newSo.paymentType.includes('Tunai') ? 'Lunas' : 'Belum Dibayar',
      paymentMethod: newSo.paymentType
    })

    return newSo
  }

  const updateSalesOrder = (id: string, updated: Partial<SalesOrder>) => {
    const idx = salesOrders.value.findIndex((so) => so.id === id)
    if (idx !== -1) {
      salesOrders.value[idx] = { ...salesOrders.value[idx], ...updated }
    }
  }

  const deleteSalesOrder = (id: string) => {
    const so = salesOrders.value.find((s) => s.id === id)
    if (so) {
      salesInvoices.value = salesInvoices.value.filter((inv) => inv.soNumber !== so.soNumber)
      deliveryOrders.value = deliveryOrders.value.filter((d) => d.soNumber !== so.soNumber)
    }
    salesOrders.value = salesOrders.value.filter((s) => s.id !== id)
  }

  // ==========================================
  // CRUD OPERATIONS: CHART OF ACCOUNTS (COA)
  // ==========================================
  const addAccount = (acc: ChartOfAccount) => {
    chartOfAccounts.value.push(acc)
    chartOfAccounts.value.sort((a, b) => a.accountCode.localeCompare(b.accountCode))
    return acc
  }

  const updateAccount = (accountCode: string, updated: Partial<ChartOfAccount>) => {
    const idx = chartOfAccounts.value.findIndex((acc) => acc.accountCode === accountCode)
    if (idx !== -1) {
      chartOfAccounts.value[idx] = { ...chartOfAccounts.value[idx], ...updated }
    }
  }

  const deleteAccount = (accountCode: string) => {
    chartOfAccounts.value = chartOfAccounts.value.filter((acc) => acc.accountCode !== accountCode)
  }

  // ==========================================
  // CRUD OPERATIONS: JOURNAL ENTRIES
  // ==========================================
  const addJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'journalNumber'>) => {
    const num = String(journalEntries.value.length + 1).padStart(3, '0')
    const newEntry: JournalEntry = {
      ...entryData,
      id: `JRN-${num}`,
      journalNumber: `JRN-2026-${num}`
    }
    journalEntries.value.unshift(newEntry)
    return newEntry
  }

  const deleteJournalEntry = (id: string) => {
    journalEntries.value = journalEntries.value.filter((j) => j.id !== id)
  }

  return {
    products,
    suppliers,
    customers,
    purchaseOrders,
    goodsReceipts,
    goodsReturns,
    stockItems,
    stockMovements,
    stockAdjustments,
    stockTransfers,
    salesOrders,
    deliveryOrders,
    salesInvoices,
    chartOfAccounts,
    journalEntries,
    cashBankTransactions,
    receivables,
    payables,
    filteredStock,
    filteredPurchaseOrders,
    filteredGoodsReceipts,
    filteredGoodsReturns,
    filteredSalesOrders,
    filteredDeliveryOrders,
    filteredSalesInvoices,
    filteredStockMovements,
    filteredStockAdjustments,
    filteredStockTransfers,
    dashboardMetrics,
    lowStockAlerts,
    recentSales,
    recentPurchaseOrders,
    outstandingInvoices,
    // CRUD methods
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    addGoodsReceipt,
    addGoodsReturn,
    addStockAdjustment,
    deleteStockAdjustment,
    addStockTransfer,
    deleteStockTransfer,
    addSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    addAccount,
    updateAccount,
    deleteAccount,
    addJournalEntry,
    deleteJournalEntry
  }
})
