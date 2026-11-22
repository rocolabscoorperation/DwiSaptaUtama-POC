import type { SalesOrder, DeliveryOrder, SalesInvoice } from '~~/shared/types'

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO-001',
    soNumber: 'SO-2026-001',
    customerId: 'CUST-001',
    customerName: 'PT Bali Sunset Resort & Spa Hotel',
    customerType: 'Corporate',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-14',
    deliveryDate: '2026-11-14',
    paymentType: 'Kredit (TOP 30)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 350,
        unitPrice: 20000,
        subtotal: 7000000
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        sku: 'AQ-BTL-600ML',
        unit: 'Karton (24 btl)',
        qty: 30,
        unitPrice: 50000,
        subtotal: 1500000
      }
    ],
    totalAmount: 8500000,
    status: 'Terkirim',
    notes: 'Pasokan berkala hotel. Penagihan invoice TOP 30 hari.'
  },
  {
    id: 'SO-002',
    soNumber: 'SO-2026-002',
    customerId: 'CUST-002',
    customerName: 'Toko Berkah Jaya Mart (Grosir)',
    customerType: 'Reseller',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-16',
    deliveryDate: '2026-11-16',
    paymentType: 'Kredit (TOP 14)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 150,
        unitPrice: 20000,
        subtotal: 3000000
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        sku: 'AQ-BTL-600ML',
        unit: 'Karton (24 btl)',
        qty: 30,
        unitPrice: 50000,
        subtotal: 1500000
      }
    ],
    totalAmount: 4500000,
    status: 'Selesai & Lunas',
    notes: 'Telah dilunasi via transfer bank Mandiri pada 18 Nov 2026.'
  },
  {
    id: 'SO-003',
    soNumber: 'SO-2026-003',
    customerId: 'CUST-003',
    customerName: 'Restoran Warung Sari Rasa Sanur',
    customerType: 'Retail',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-19',
    deliveryDate: '2026-11-19',
    paymentType: 'Tunai (COD)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 50,
        unitPrice: 20000,
        subtotal: 1000000
      }
    ],
    totalAmount: 1000000,
    status: 'Selesai & Lunas',
    notes: 'Pembayaran tunai di tempat diserahkan ke kasir depot oleh sopir.'
  },
  {
    id: 'SO-004',
    soNumber: 'SO-2026-004',
    customerId: 'CUST-004',
    customerName: 'CV Dewata Mitra Distribusi',
    customerType: 'Reseller',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    orderDate: '2026-11-20',
    deliveryDate: '2026-11-20',
    paymentType: 'Kredit (TOP 21)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 250,
        unitPrice: 20000,
        subtotal: 5000000
      },
      {
        productId: 'PROD-003',
        productName: 'Aqua 1500ml per Karton',
        sku: 'AQ-BTL-1500ML',
        unit: 'Karton (12 btl)',
        qty: 50,
        unitPrice: 53000,
        subtotal: 2650000
      }
    ],
    totalAmount: 7650000,
    status: 'Terkirim',
    notes: 'Distribusi wilayah Jimbaran Selatan dan Pecatu.'
  },
  {
    id: 'SO-005',
    soNumber: 'SO-2026-005',
    customerId: 'CUST-005',
    customerName: 'Ibu Komang Suartini (Rumah Tangga)',
    customerType: 'Retail',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    orderDate: '2026-11-21',
    deliveryDate: '2026-11-21',
    paymentType: 'Tunai',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 5,
        unitPrice: 20000,
        subtotal: 100000
      }
    ],
    totalAmount: 100000,
    status: 'Selesai & Lunas',
    notes: 'Pengambilan langsung di loket depot Jimbaran.'
  },
  {
    id: 'SO-006',
    soNumber: 'SO-2026-006',
    customerId: 'CUST-001',
    customerName: 'PT Bali Sunset Resort & Spa Hotel',
    customerType: 'Corporate',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    orderDate: '2026-11-22',
    deliveryDate: '2026-11-23',
    paymentType: 'Kredit (TOP 30)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        sku: 'AQ-GALON-19L',
        unit: 'Galon',
        qty: 250,
        unitPrice: 20000,
        subtotal: 5000000
      }
    ],
    totalAmount: 5000000,
    status: 'Diproses',
    notes: 'Order baru sedang dijadwalkan armada pengirimannya untuk besok pagi.'
  }
]

export const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'DO-001',
    doNumber: 'DO-2026-001',
    soNumber: 'SO-2026-001',
    customerId: 'CUST-001',
    customerName: 'PT Bali Sunset Resort & Spa Hotel',
    customerAddress: 'Jl. Pantai Kuta No. 10, Kuta, Badung',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    deliveryDate: '2026-11-14',
    driverName: 'Kadek Arta Wijaya',
    vehiclePlate: 'DK 8291 AB (Truk Engkel)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        qty: 350,
        unit: 'Galon'
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        qty: 30,
        unit: 'Karton (24 btl)'
      }
    ],
    status: 'Terkirim & Diterima',
    recipientName: 'Agus Wibawa (Receiving Dept Hotel)',
    receivedTime: '2026-11-14 14:15',
    notes: 'Diterima utuh tanpa cacat segel.'
  },
  {
    id: 'DO-002',
    doNumber: 'DO-2026-002',
    soNumber: 'SO-2026-002',
    customerId: 'CUST-002',
    customerName: 'Toko Berkah Jaya Mart (Grosir)',
    customerAddress: 'Jl. Raya Sesetan No. 102, Denpasar',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    deliveryDate: '2026-11-16',
    driverName: 'Wayan Agus Setiawan',
    vehiclePlate: 'DK 7120 CD (Pick Up GrandMax)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        qty: 150,
        unit: 'Galon'
      },
      {
        productId: 'PROD-002',
        productName: 'Aqua 600ml per Karton',
        qty: 30,
        unit: 'Karton (24 btl)'
      }
    ],
    status: 'Terkirim & Diterima',
    recipientName: 'Pak Haji Rahmat (Pemilik Toko)',
    receivedTime: '2026-11-16 11:30',
    notes: 'Surat jalan ttd dan cap toko.'
  },
  {
    id: 'DO-003',
    doNumber: 'DO-2026-003',
    soNumber: 'SO-2026-003',
    customerId: 'CUST-003',
    customerName: 'Restoran Warung Sari Rasa Sanur',
    customerAddress: 'Jl. Bypass Ngurah Rai No. 230, Sanur',
    depotId: 'DEP-001',
    depotName: 'Depot Denpasar',
    deliveryDate: '2026-11-19',
    driverName: 'Ketut Budiasa',
    vehiclePlate: 'DK 9012 EF (Pick Up)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        qty: 50,
        unit: 'Galon'
      }
    ],
    status: 'Terkirim & Diterima',
    recipientName: 'Bu Made Sari (Kasir Resto)',
    receivedTime: '2026-11-19 15:40',
    notes: 'Uang tunai Rp 1.000.000 telah diserahkan dan disetor ke kasir.'
  },
  {
    id: 'DO-004',
    doNumber: 'DO-2026-004',
    soNumber: 'SO-2026-004',
    customerId: 'CUST-004',
    customerName: 'CV Dewata Mitra Distribusi',
    customerAddress: 'Jl. Gatot Subroto Timur No. 55, Denpasar',
    depotId: 'DEP-002',
    depotName: 'Depot Jimbaran',
    deliveryDate: '2026-11-20',
    driverName: 'Gede Suastika',
    vehiclePlate: 'DK 6643 GH (Truk Box)',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Aqua Galon 19 Liter',
        qty: 250,
        unit: 'Galon'
      },
      {
        productId: 'PROD-003',
        productName: 'Aqua 1500ml per Karton',
        qty: 50,
        unit: 'Karton (12 btl)'
      }
    ],
    status: 'Terkirim & Diterima',
    recipientName: 'I Nyoman Darmawan',
    receivedTime: '2026-11-20 16:10',
    notes: 'Serah terima barang selesai sesuai PO customer.'
  }
]

export const mockSalesInvoices: SalesInvoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2026-001',
    soNumber: 'SO-2026-001',
    doNumber: 'DO-2026-001',
    customerId: 'CUST-001',
    customerName: 'PT Bali Sunset Resort & Spa Hotel',
    invoiceDate: '2026-11-14',
    dueDate: '2026-12-14',
    totalAmount: 8500000,
    paidAmount: 0,
    outstandingAmount: 8500000,
    status: 'Belum Dibayar',
    paymentMethod: 'Transfer Rekening Mandiri'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2026-002',
    soNumber: 'SO-2026-002',
    doNumber: 'DO-2026-002',
    customerId: 'CUST-002',
    customerName: 'Toko Berkah Jaya Mart (Grosir)',
    invoiceDate: '2026-11-16',
    dueDate: '2026-11-30',
    totalAmount: 4500000,
    paidAmount: 4500000,
    outstandingAmount: 0,
    status: 'Lunas',
    paymentMethod: 'Transfer Rekening Mandiri (Lunas 18/11)'
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2026-003',
    soNumber: 'SO-2026-003',
    doNumber: 'DO-2026-003',
    customerId: 'CUST-003',
    customerName: 'Restoran Warung Sari Rasa Sanur',
    invoiceDate: '2026-11-19',
    dueDate: '2026-11-19',
    totalAmount: 1000000,
    paidAmount: 1000000,
    outstandingAmount: 0,
    status: 'Lunas',
    paymentMethod: 'Tunai Kasir (COD Lunas)'
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2026-004',
    soNumber: 'SO-2026-004',
    doNumber: 'DO-2026-004',
    customerId: 'CUST-004',
    customerName: 'CV Dewata Mitra Distribusi',
    invoiceDate: '2026-11-20',
    dueDate: '2026-12-11',
    totalAmount: 7650000,
    paidAmount: 0,
    outstandingAmount: 7650000,
    status: 'Belum Dibayar',
    paymentMethod: 'Transfer Rekening BCA'
  }
]

