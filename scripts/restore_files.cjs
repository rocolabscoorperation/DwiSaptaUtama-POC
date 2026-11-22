const fs = require('fs');
const readline = require('readline');

const mishapFiles = [
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

async function restore() {
  const fileStream = fs.createReadStream('/Users/akangromeo/.gemini/antigravity/brain/5c90e841-fff2-4eab-bb4a-16149048c63a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const cleanMap = new Map();

  for await (const line of rl) {
    if (!line.includes('"write_file"')) continue;
    try {
      const data = JSON.parse(line);
      const calls = data?.tool_calls || [];
      for (const call of calls) {
        if (call.name === 'write_file' && call.args?.Path && call.args?.Content) {
          cleanMap.set(call.args.Path, call.args.Content);
        }
      }
    } catch (e) {}
  }

  let restoredCount = 0;
  for (const relPath of mishapFiles) {
    const absPath = '/Users/akangromeo/Documents/Freelance/DwiSaptaUtama-POC/' + relPath;
    if (cleanMap.has(absPath)) {
      fs.writeFileSync(absPath, cleanMap.get(absPath), 'utf8');
      restoredCount++;
      console.log(`[RESTORED] ${relPath}`);
    } else {
      console.warn(`[NOT FOUND IN TRANSCRIPT] ${relPath}`);
    }
  }

  console.log(`\nSuccessfully restored ${restoredCount} / ${mishapFiles.length} files.`);
}

restore();

