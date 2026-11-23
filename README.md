# PT Dwi Sapta Utama — Aqua Distribution ERP Prototype (PoC)

Frontend-only Enterprise Resource Planning (ERP) Prototype untuk bisnis distribusi air minum dalam kemasan (Aqua Galon 19L dan varian botol kartonan) di Bali, Indonesia.

Aplikasi ini dikembangkan sebagai client-facing **Proof of Concept (PoC)** dengan tampilan enterprise profesional yang terinspirasi oleh **SAP Fiori / SAP S/4HANA**, mendemonstrasikan hubungan keterpaduan data lintas departemen:
**Purchase Order → Goods Receipt → Penambahan Persediaan → Sales Order → Surat Jalan (DO) → Faktur (Invoice) → Pelunasan Kas/Bank → Jurnal Umum Berimbang → Laporan Laba Rugi.**

---

## 1. Teknologi & Arsitektur

- **Framework**: Nuxt 4 (`compatibilityVersion: 4`) + Vue 3 Composition API
- **Bahasa**: TypeScript (`strict: true`)
- **Desain & Styling**: Tailwind CSS + Nuxt UI (Palette & Komponen SAP Fiori Enterprise)
- **State Management**: Pinia (Auth Store, Depot Context Store, ERP Central Store)
- **Ikonografi**: Lucide Icons (`lucide-vue-next`)
- **Visualisasi & Grafik**: Apache ECharts (`echarts` client wrapper dengan auto-resize)
- **Sumber Data**: Centralized TypeScript Fixtures & Mock Data (tanpa database/backend)

---

## 2. Struktur Proyek Modular

```
DwiSaptaUtama-POC/
├── app/
│   ├── assets/css/main.css         # Styling enterprise, typography, custom compact scrollbars
│   ├── components/
│   │   ├── layout/                 # AppHeader, AppSidebar, DepotSelector, UserMenu, AppBreadcrumb
│   │   ├── shared/                 # PageHeader, MetricCard, StatusBadge, SearchFilterBar, EmptyState
│   │   └── ui/                     # EChart.client.vue (client-only chart wrapper)
│   ├── composables/                # useCurrency (Rupiah), useDate (ID date), useBreadcrumbs
│   ├── layouts/                    # default.vue (shell navigasi) & auth.vue (login)
│   ├── middleware/                 # auth.global.ts (simulasi route guard & izin peran)
│   ├── mocks/                      # Centralized mock fixtures: depots, users, products, suppliers, customers, purchasing, inventory, sales, finance
│   ├── pages/
│   │   ├── index.vue               # Redirection ke dashboard
│   │   ├── login.vue               # Halaman login dengan 1-click demo switcher
│   │   ├── dashboard/              # 6 KPI cards, 3 visual ECharts, 4 tabel operasional
│   │   ├── master-data/            # Produk & Galon, Pelanggan, Pemasok/Pabrik, Depot
│   │   ├── purchasing/             # Purchase Orders (PO), Goods Receipts (GR)
│   │   ├── inventory/              # Stock Overview, Mutasi Stok, Stock Opname, Transfer Depot
│   │   ├── sales/                  # Sales Orders (SO), Surat Jalan (DO), Faktur (Invoice)
│   │   ├── finance/                # Bagan Akun (COA), Jurnal Umum, Kas & Bank, Piutang (AR), Utang (AP)
│   │   ├── reports/                # Laporan Penjualan, Laporan Persediaan, Laporan Laba Rugi
│   │   └── settings/               # Manajemen Pengguna & Matriks Hak Akses Peran
│   └── stores/                     # auth.ts, depot.ts, erp.ts
├── shared/
│   ├── constants/                  # menu.ts, roles.ts
│   └── types/                      # TypeScript definitions (auth, master, purchasing, inventory, sales, finance)
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

---

## 3. Akun Demo & Matriks Hak Akses

Semua akun demo menggunakan kata sandi: `demo123`

| No  | Peran (Role)           | Email Demo            | Password  | Cakupan Depot              | Tanggung Jawab & Modul Akses                                             |
| --- | ---------------------- | --------------------- | --------- | -------------------------- | ------------------------------------------------------------------------ |
| 1   | **Super Admin**        | `superadmin@demo.com` | `demo123` | Semua Depot (DPS & JBR)    | Akses seluruh modul, manajemen user, dan hak akses                       |
| 2   | **Owner / Management** | `owner@demo.com`      | `demo123` | Semua Depot (DPS & JBR)    | Dashboard analitik eksekutif, rekapitulasi keuangan, dan laporan         |
| 3   | **Admin Depot**        | `admin@demo.com`      | `demo123` | Depot Denpasar (`DEP-001`) | Operasional harian cabang: master data, PO, stok, dan penjualan          |
| 4   | **Purchasing Staff**   | `purchasing@demo.com` | `demo123` | Semua Depot                | Pengadaan pabrik Danone, data supplier, dan PO                           |
| 5   | **Warehouse Staff**    | `warehouse@demo.com`  | `demo123` | Depot Denpasar (`DEP-001`) | Penerimaan barang (GR), kartu stok, opname, dan transfer antar depot     |
| 6   | **Sales Staff**        | `sales@demo.com`      | `demo123` | Semua Depot                | Pengelolaan mitra pelanggan, sales order, surat jalan, dan faktur        |
| 7   | **Finance Staff**      | `finance@demo.com`    | `demo123` | Semua Depot                | Buku kas/bank, jurnal umum, kontrol piutang (AR) & utang (AP), laba rugi |

_Tip Demo: Pengguna dapat berganti peran secara instan melalui dropdown profil di sudut kanan atas header menggunakan fitur **Simulasi Ganti Peran (PoC Demo)**._

---

## 4. Konteks Wilayah Depot

Sistem mendukung switching pangkalan depot langsung dari dropdown header:

1. **Depot Denpasar (`DEP-001`)**: Jl. Teuku Umar Barat No. 88, Denpasar.
2. **Depot Jimbaran (`DEP-002`)**: Jl. Raya Uluwatu No. 45, Jimbaran, Badung.
3. **Semua Depot (Konsolidasi)**: Rekapitulasi gabungan performa (khusus Super Admin dan Owner).

Saat konteks depot diubah:

- Metrik KPI di dashboard menyesuaikan nilai penjualan, pembelian, dan valuasi stok depot terpilih.
- Grafik tren penjualan dan perputaran produk memperbarui data series secara real-time.
- Tabel daftar transaksi, mutasi stok, dan persediaan tersaring otomatis.

---

## 5. Cara Menjalankan Proyek

### Prasyarat

- Node.js v18+ atau v20+ (rekomendasi v20/v22)
- pnpm (rekomendasi) atau npm

### Langkah Instalasi & Menjalankan Server Pengembangan

```bash
# 1. Masuk ke direktori proyek
cd DwiSaptaUtama-POC

# 2. Pasang dependensi
pnpm install

# 3. Jalankan server pengembangan
pnpm dev
```

Aplikasi akan tersedia di: `http://localhost:3000`

### Build untuk Produksi

```bash
pnpm build
node .output/server/index.mjs
```

---

## 6. Standar Tampilan SAP Fiori Enterprise

- **Warna Utama**: Deep Navy Blue (`#0b2447`, `#0f3b6c`) melambangkan profesionalitas enterprise distribusi Aqua.
- **Warna Permukaan**: Neutral light gray (`#f5f7fa`) dengan batas tipis (`#e2e8f0`).
- **Indikator Status Semantic**:
  - Hijau (`emerald`): Selesai, Diterima Penuh, Lunas, Aman, Aktif.
  - Kuning/Oranye (`amber`): Menipis, Sebagian Diterima, Belum Dibayar, Dalam Transit, Diproses.
  - Merah (`rose`): Kritis, Jatuh Tempo, Rusak/Cacat, Inaktif.
- **Kepadatan Informasi**: Tata letak ringkas (_compact mode_) dengan angka tabular monospaced untuk nilai Rupiah dan kuantitas fisik.
