import type { RootStackParamList } from '../navigation/types';

export interface DemoCatalogItem {
  route: keyof RootStackParamList;
  title: string;
  subtitle: string;
  detail: string;
  path: string;
}

export const DEMO_CATALOG: DemoCatalogItem[] = [
  {
    route: 'Pad',
    title: 'Pad Demo',
    subtitle: 'Native pad cockpit',
    detail: 'Touch-friendly workload cards, pad table, numeric keypad and responsive shell — all rendered natively.',
    path: '/pad',
  },
  {
    route: 'StdReport',
    title: 'Standard Report',
    subtitle: 'CStandardPage via WebView',
    detail: 'Loads the orbcafe-ui standard report page inside a WebView so table behaviour stays identical.',
    path: '/std-report',
  },
  {
    route: 'Kanban',
    title: 'Kanban Board',
    subtitle: 'CKanbanBoard via WebView',
    detail: 'Uses the orbcafe-ui kanban page via WebView so drag-and-drop and card rendering work identically.',
    path: '/kanban',
  },
  {
    route: 'PivotTable',
    title: 'Pivot Table',
    subtitle: 'CPivotTable via WebView',
    detail: 'Loads the orbcafe-ui pivot table via WebView to preserve presets and chart rendering.',
    path: '/pivot-table',
  },
  {
    route: 'AgentUI',
    title: 'Agent UI',
    subtitle: 'Chat via WebView',
    detail: 'Loads the orbcafe-ui chat page via WebView to keep markdown and card behaviour consistent.',
    path: '/chat',
  },
];
