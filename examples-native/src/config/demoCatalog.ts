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
    subtitle: 'Full ORBCAFE pad cockpit',
    detail: 'Matches the original workload cards, pad table, keypad, scanner, and responsive shell from `/pad`.',
    path: '/pad',
  },
  {
    route: 'StdReport',
    title: 'Standard Report',
    subtitle: 'Original CStandardPage example',
    detail: 'Loads the existing `/std-report` example page inside React Native so table behavior stays identical.',
    path: '/std-report',
  },
  {
    route: 'Kanban',
    title: 'Kanban Board',
    subtitle: 'Original CKanbanBoard example',
    detail: 'Uses the real `/kanban` example page instead of a placeholder native mock.',
    path: '/kanban',
  },
  {
    route: 'PivotTable',
    title: 'Pivot Table',
    subtitle: 'Original CPivotTable example',
    detail: 'Loads `/pivot-table` from the web examples app to preserve presets and layout behavior.',
    path: '/pivot-table',
  },
  {
    route: 'AgentUI',
    title: 'Agent UI',
    subtitle: 'Original chat example',
    detail: 'Loads `/chat` from the examples app to keep markdown and card behavior consistent.',
    path: '/chat',
  },
];
