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
    route: 'StdReport',
    title: 'Standard Report',
    subtitle: 'Native MStandardPage',
    detail: 'Runs the standard report natively with smart filters, saved variants, layout persistence, sorting and pagination.',
    path: '/std-report',
  },
  {
    route: 'Kanban',
    title: 'Kanban Board',
    subtitle: 'Mobile board entry',
    detail: 'Shows the current native Kanban board with touch-friendly bucket lanes and task cards for phone and pad review.',
    path: '/kanban',
  },
  {
    route: 'AgentUI',
    title: 'Agent UI',
    subtitle: 'Chat via WebView',
    detail: 'Loads the orbcafe-ui chat page via WebView to keep markdown and card behavior consistent.',
    path: '/chat',
  },
];
