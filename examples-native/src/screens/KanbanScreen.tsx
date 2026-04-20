import React from 'react';
import {
  MKanbanBoard,
  type MKanbanBucketData,
} from 'orbmobile-ui';

const KANBAN_BUCKETS: MKanbanBucketData[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    subtitle: 'Waiting for commitment',
    accentColor: '#64748B',
    cardStatus: 'neutral',
    cardStatusLabel: 'Planned',
    cards: [
      {
        id: 'kb-1',
        title: 'Inventory recount for store cluster A',
        description: 'Prepare the adjustment list and confirm abnormal stock movement before lock.',
        status: 'neutral',
        facts: [
          { label: 'Owner', value: 'Amy' },
          { label: 'Due', value: 'Apr 22' },
          { label: 'Items', value: '14 SKUs' },
        ],
        tags: ['Stock', 'Store Ops'],
      },
      {
        id: 'kb-2',
        title: 'Prepare returns intake checklist',
        description: 'Align inbound check steps with finance and warehouse before next rollout.',
        status: 'warning',
        facts: [
          { label: 'Owner', value: 'Noah' },
          { label: 'Due', value: 'Apr 24' },
        ],
        tags: ['Returns'],
      },
    ],
  },
  {
    id: 'active',
    title: 'In Progress',
    subtitle: 'Current execution window',
    accentColor: '#3B82F6',
    cardStatus: 'info',
    cardStatusLabel: 'In progress',
    limit: 4,
    cards: [
      {
        id: 'kb-3',
        title: 'Cycle count discrepancy review',
        description: 'Investigate mismatches from the morning count and collect supervisor approval.',
        status: 'info',
        facts: [
          { label: 'Owner', value: 'Shen' },
          { label: 'Warehouse', value: 'WH-02' },
          { label: 'Priority', value: 'High' },
        ],
        tags: ['Count', 'Urgent'],
      },
      {
        id: 'kb-4',
        title: 'Touch device picking test',
        description: 'Validate the native touch flow on phone and pad before warehouse pilot.',
        status: 'info',
        facts: [
          { label: 'Owner', value: 'Iris' },
          { label: 'Devices', value: '2 iPhones / 1 iPad' },
        ],
        tags: ['Mobile', 'Pilot'],
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    subtitle: 'Needs decision or sign-off',
    accentColor: '#F59E0B',
    cardStatus: 'warning',
    cardStatusLabel: 'Review',
    cards: [
      {
        id: 'kb-5',
        title: 'Supplier shortage exception approval',
        description: 'Need manager sign-off before reallocation can be released to stores.',
        status: 'warning',
        facts: [
          { label: 'Owner', value: 'Lucas' },
          { label: 'Vendor', value: 'Delta Foods' },
        ],
        tags: ['Approval'],
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    subtitle: 'Closed this week',
    accentColor: '#22C55E',
    cardStatus: 'success',
    cardStatusLabel: 'Done',
    cards: [
      {
        id: 'kb-6',
        title: 'Scanner receiving checklist published',
        description: 'Shared the final checklist with warehouse leads and attached onboarding notes.',
        status: 'success',
        facts: [
          { label: 'Owner', value: 'Mia' },
          { label: 'Completed', value: 'Today' },
        ],
        tags: ['Ready'],
      },
    ],
  },
];

export function KanbanScreen() {
  return (
    <MKanbanBoard
      title="KANBAN BOARD"
      subtitle="Touch-first board demo."
      buckets={KANBAN_BUCKETS}
      testID="kanban-screen"
    />
  );
}
