import React from 'react';
import { OrbWebView } from '../WebViewBridge/OrbWebView';
import type { OrbWebViewProps } from '../WebViewBridge/types';

export interface CPivotTableProps extends OrbWebViewProps {
  /** Override the web path (default: `/pivot-table`) */
  path?: string;
}

/**
 * Pivot Table rendered via WebView.
 *
 * Wraps the orbcafe-ui `CPivotTable` example so presets, drag-and-drop
 * configuration and chart rendering all work identically to the web version.
 */
export const CPivotTable: React.FC<CPivotTableProps> = ({
  path = '/pivot-table',
  ...rest
}) => <OrbWebView path={path} {...rest} />;
