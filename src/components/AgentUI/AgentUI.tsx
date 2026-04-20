import React from 'react';
import { OrbWebView } from '../WebViewBridge/OrbWebView';
import type { OrbWebViewProps } from '../WebViewBridge/types';

export interface MAgentUIProps extends OrbWebViewProps {
  /** Override the web path (default: `/chat`) */
  path?: string;
}

/**
 * Agent / Chat UI rendered via WebView.
 *
 * Wraps the orbcafe-ui `MAgentUI` example page so markdown rendering, card
 * interactions and streaming behaviour all work identically to the web version.
 */
export const MAgentUI: React.FC<MAgentUIProps> = ({
  path = '/chat',
  ...rest
}) => <OrbWebView path={path} {...rest} />;
