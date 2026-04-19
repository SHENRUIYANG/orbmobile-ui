import React from 'react';
import { OrbWebView } from '../WebViewBridge/OrbWebView';
import type { OrbWebViewProps } from '../WebViewBridge/types';

export interface AgentUIProps extends OrbWebViewProps {
  /** Override the web path (default: `/chat`) */
  path?: string;
}

/**
 * Agent / Chat UI rendered via WebView.
 *
 * Wraps the orbcafe-ui `AgentUI` example page so markdown rendering, card
 * interactions and streaming behaviour all work identically to the web version.
 */
export const AgentUI: React.FC<AgentUIProps> = ({
  path = '/chat',
  ...rest
}) => <OrbWebView path={path} {...rest} />;
