import React from 'react';
import { MStandardPage } from 'orbmobile-ui';
import type { ColumnDef, FilterField } from 'orbmobile-ui';

const columns: ColumnDef[] = [
  { key: 'orderNo', label: 'Order', sortable: true, flex: 1.1 },
  { key: 'customer', label: 'Customer', sortable: true, flex: 1.5 },
  { key: 'region', label: 'Region', sortable: true, flex: 0.9 },
  { key: 'status', label: 'Status', sortable: true, flex: 0.9 },
  { key: 'owner', label: 'Owner', sortable: true, flex: 0.9 },
  { key: 'amount', label: 'Amount', sortable: true, flex: 0.9 },
  { key: 'createdAt', label: 'Created', sortable: true, flex: 1.1 },
];

const filters: FilterField[] = [
  { id: 'orderNo', label: 'Order', type: 'text', placeholder: 'SO-1001' },
  {
    id: 'customer',
    label: 'Customer',
    type: 'text',
    placeholder: 'Search customer',
  },
  {
    id: 'region',
    label: 'Region',
    type: 'select',
    options: [
      { label: 'North', value: 'North' },
      { label: 'South', value: 'South' },
      { label: 'East', value: 'East' },
      { label: 'West', value: 'West' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Open', value: 'Open' },
      { label: 'In Review', value: 'In Review' },
      { label: 'Blocked', value: 'Blocked' },
      { label: 'Closed', value: 'Closed' },
    ],
  },
  { id: 'owner', label: 'Owner', type: 'text', placeholder: 'Owner name' },
  { id: 'amount', label: 'Amount', type: 'number', placeholder: '1000' },
];

const data = [
  { orderNo: 'SO-1001', customer: 'Apex Motors', region: 'North', status: 'Open', owner: 'Lina', amount: 18250, createdAt: '2026-04-02' },
  { orderNo: 'SO-1002', customer: 'Blue Harbor', region: 'East', status: 'In Review', owner: 'Ethan', amount: 9650, createdAt: '2026-04-03' },
  { orderNo: 'SO-1003', customer: 'City Retail', region: 'South', status: 'Blocked', owner: 'Nora', amount: 4200, createdAt: '2026-04-04' },
  { orderNo: 'SO-1004', customer: 'Delta Works', region: 'West', status: 'Open', owner: 'Mason', amount: 22100, createdAt: '2026-04-05' },
  { orderNo: 'SO-1005', customer: 'Evergreen Foods', region: 'North', status: 'Closed', owner: 'Lina', amount: 7800, createdAt: '2026-04-06' },
  { orderNo: 'SO-1006', customer: 'Futura Labs', region: 'East', status: 'Open', owner: 'Kai', amount: 13120, createdAt: '2026-04-07' },
  { orderNo: 'SO-1007', customer: 'Golden Leaf', region: 'South', status: 'In Review', owner: 'Nora', amount: 15640, createdAt: '2026-04-08' },
  { orderNo: 'SO-1008', customer: 'Helix Medical', region: 'West', status: 'Closed', owner: 'Mason', amount: 24890, createdAt: '2026-04-09' },
  { orderNo: 'SO-1009', customer: 'Ion Systems', region: 'North', status: 'Blocked', owner: 'Ethan', amount: 5100, createdAt: '2026-04-10' },
  { orderNo: 'SO-1010', customer: 'Jetstream Telecom', region: 'East', status: 'Open', owner: 'Kai', amount: 30400, createdAt: '2026-04-11' },
  { orderNo: 'SO-1011', customer: 'Kepler Energy', region: 'South', status: 'Closed', owner: 'Lina', amount: 11990, createdAt: '2026-04-12' },
  { orderNo: 'SO-1012', customer: 'Lumen Stores', region: 'West', status: 'In Review', owner: 'Mason', amount: 8750, createdAt: '2026-04-13' },
];

export function StdReportScreen() {
  return (
    <MStandardPage
      testID="std-report-screen"
      appId="examples-native"
      tableKey="sales-orders"
      title="Sales Orders"
      columns={[...columns]}
      filters={[...filters]}
      data={[...data]}
      pageSize={6}
    />
  );
}
