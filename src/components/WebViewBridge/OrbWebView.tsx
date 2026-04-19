import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { BRAND_COLORS, SPACING } from '../../config/foundations';
import { getOrbmobileBaseUrl } from './config';
import type { OrbWebViewProps, WebViewIncomingMessage } from './types';

export interface OrbWebViewComponentProps extends OrbWebViewProps {
  /** Path appended to the base URL, e.g. `/std-report` */
  path: string;
  /** Additional style for the wrapper View */
  style?: ViewStyle;
}

/**
 * A standardised WebView wrapper that loads a page from the orbcafe-ui web
 * examples server.  All complex component screens use this under the hood.
 */
export const OrbWebView: React.FC<OrbWebViewComponentProps> = ({
  path,
  baseUrl,
  testID,
  onMessage,
  onLoad,
  onError,
  style,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const resolvedUrl = (baseUrl ?? getOrbmobileBaseUrl()) + path;

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data: WebViewIncomingMessage = JSON.parse(event.nativeEvent.data);
        onMessage?.(data);
      } catch {
        // ignore non-JSON messages
      }
    },
    [onMessage],
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={BRAND_COLORS.accent} />
          <Text style={styles.loaderText}>Loading…</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: resolvedUrl }}
        style={styles.webview}
        onLoadEnd={() => {
          setLoading(false);
          onLoad?.();
        }}
        onError={(syntheticEvent) => {
          setLoading(false);
          onError?.(new Error(syntheticEvent.nativeEvent.description));
        }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_COLORS.background,
    zIndex: 1,
    gap: SPACING.sm,
  },
  loaderText: {
    color: BRAND_COLORS.textMuted,
    fontSize: 14,
  },
});
