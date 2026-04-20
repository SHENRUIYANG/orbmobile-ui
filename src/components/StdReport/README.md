# StdReport

`StdReport` is the primary native report composition in `orbmobile-ui`.

Use this folder when you need the full "smart filter + saved variants + layout + grouping + sorting + report cards" flow.

## Public API

- `MStandardPage`: ready-to-use integrated report page
- `useStandardReport`: state + persistence hook for custom report shells
- `types.ts`: data contracts for columns, filters, variants, layouts, and row data

## Typical Usage

```tsx
import React from 'react';
import { MStandardPage, type ColumnDef, type FilterField } from 'orbmobile-ui';

const columns: ColumnDef[] = [
  { key: 'orderNo', label: 'Order', sortable: true, flex: 1.1 },
  { key: 'customer', label: 'Customer', sortable: true, flex: 1.5 },
];

const filters: FilterField[] = [
  { id: 'orderNo', label: 'Order', type: 'text', placeholder: 'SO-1001' },
  { id: 'customer', label: 'Customer', type: 'text', placeholder: 'Search customer' },
];

export function SalesOrdersScreen() {
  return (
    <MStandardPage
      appId="examples-native"
      tableKey="sales-orders"
      title="Sales Orders"
      columns={columns}
      filters={filters}
      data={[]}
    />
  );
}
```

## Hook Usage

Use `useStandardReport` when the screen needs a custom shell but should keep the same filtering, grouping, sorting, and variant/layout persistence behavior.

```tsx
const report = useStandardReport({
  appId: 'examples-native',
  tableKey: 'sales-orders',
  columns,
  filters,
  data,
});
```

Useful fields returned by the hook:

- `visibleColumns`, `filteredRows`, `listEntries`
- `filterValues`, `updateFilters`, `clearFilters`
- `groupByKey`, `handleGroupByChange`, `collapsedGroupKeys`
- `sortKey`, `setSortKey`, `sortAsc`, `setSortAsc`, `clearSort`
- `variants`, `layouts`, save/apply/delete/default handlers

## Persistence

- Variants are stored in AsyncStorage key `orbcafe.variants.{appId}.{tableKey}`
- Layouts are stored in AsyncStorage key `orbcafe.layouts.{appId}.{tableKey}`

## Folder Intent

- Put reusable report composition logic here
- Keep examples focused on passing data/config into `MStandardPage`
- If a new report behavior should be reused across screens, add it to this folder, not `examples-native/`
