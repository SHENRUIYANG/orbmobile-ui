import React from 'react';
import { OrbWebView } from '../WebViewBridge/OrbWebView';
import type { OrbWebViewProps } from '../WebViewBridge/types';

export interface CStandardPageProps extends OrbWebViewProps {
  /** Override the web path (default: `/std-report`) */
  path?: string;
}

/**
 * Standard Report page rendered via WebView.
 *
 * Wraps the orbcafe-ui `CStandardPage` example page so that table behaviour,
 * filtering, pagination, grouping and layout management all work identically
 * to the web version.
 */
export const CStandardPage: React.FC<CStandardPageProps> = ({
  path = '/std-report',
  ...rest
}) => <OrbWebView path={path} {...rest} />;
