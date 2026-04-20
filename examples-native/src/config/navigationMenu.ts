import type { MNavigationIslandItem } from 'orbmobile-ui';
import type { RootStackParamList } from '../navigation/types';

type RouteName = keyof RootStackParamList;

export const NAVIGATION_MENU: MNavigationIslandItem<RouteName>[] = [
  {
    kind: 'item',
    route: 'Home',
    glyph: 'DB',
    title: 'Dashboard',
    subtitle: 'Overview',
  },
  {
    kind: 'group',
    id: 'workspace',
    glyph: 'WK',
    title: 'Workspace',
    subtitle: 'Business modules',
    children: [
      {
        kind: 'item',
        route: 'StdReport',
        glyph: 'SR',
        title: 'Standard Report',
        subtitle: 'Card list',
      },
      {
        kind: 'item',
        route: 'Kanban',
        glyph: 'KB',
        title: 'Kanban',
        subtitle: 'Board',
      },
    ],
  },
  {
    kind: 'group',
    id: 'assistant',
    glyph: 'AI',
    title: 'Assistant',
    subtitle: 'AI surfaces',
    children: [
      {
        kind: 'item',
        route: 'AgentUI',
        glyph: 'CH',
        title: 'Chat App',
        subtitle: 'Agent chat',
      },
    ],
  },
];
