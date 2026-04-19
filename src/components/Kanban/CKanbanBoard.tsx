import React from 'react';
import { OrbWebView } from '../WebViewBridge/OrbWebView';
import type { OrbWebViewProps } from '../WebViewBridge/types';

export interface CKanbanBoardProps extends OrbWebViewProps {
  /** Override the web path (default: `/kanban`) */
  path?: string;
}

/**
 * Kanban Board rendered via WebView.
 *
 * Wraps the orbcafe-ui `CKanbanBoard` example so drag-and-drop, bucket
 * management and card rendering all work identically to the web version.
 */
export const CKanbanBoard: React.FC<CKanbanBoardProps> = ({
  path = '/kanban',
  ...rest
}) => <OrbWebView path={path} {...rest} />;
