const fs = require('fs');

const files = [
  'app/components/layout/AppBreadcrumb.vue',
  'app/components/layout/AppHeader.vue',
  'app/components/layout/AppSidebar.vue',
  'app/components/layout/DepotSelector.vue',
  'app/components/layout/UserMenu.vue',
  'app/components/shared/ConfirmDialog.vue',
  'app/components/shared/EmptyState.vue',
  'app/components/shared/MetricCard.vue',
  'app/components/shared/PageHeader.vue',
  'app/components/shared/SearchFilterBar.vue',
  'app/components/shared/StatusBadge.vue',
  'app/pages/dashboard/index.vue',
  'app/pages/finance/cash-bank/index.vue',
  'app/pages/finance/chart-of-accounts/index.vue',
  'app/pages/finance/journal-entries/index.vue',
  'app/pages/finance/payables/index.vue',
  'app/pages/finance/receivables/index.vue',
  'app/pages/inventory/adjustments/index.vue',
  'app/pages/inventory/stock-movements/index.vue',
  'app/pages/inventory/stock-overview/index.vue',
  'app/pages/inventory/transfers/index.vue',
  'app/pages/login.vue',
  'app/pages/master-data/customers/index.vue',
  'app/pages/master-data/depots/index.vue',
  'app/pages/master-data/products/index.vue',
  'app/pages/master-data/suppliers/index.vue',
  'app/pages/purchasing/goods-receipts/index.vue',
  'app/pages/purchasing/purchase-orders/index.vue',
  'app/pages/reports/financial/index.vue',
  'app/pages/reports/inventory/index.vue',
  'app/pages/reports/sales/index.vue',
  'app/pages/sales/deliveries/index.vue',
  'app/pages/sales/invoices/index.vue',
  'app/pages/sales/sales-orders/index.vue',
  'app/pages/settings/roles/index.vue',
  'app/pages/settings/users/index.vue'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('text-s') || l.includes('text - s')) {
      console.log(`${file}:${idx + 1}: ${l}`);
    }
  });
}

