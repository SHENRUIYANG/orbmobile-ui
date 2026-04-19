/**
 * WebView bridge configuration and types.
 *
 * Complex components that are hard to reimplement natively (tables, kanban,
 * pivot charts, chat with markdown) are rendered via a WebView that loads
 * the corresponding orbcafe-ui web page served by the companion examples app.
 */

/** Message sent from React Native → WebView */
export interface WebViewOutgoingMessage {
  type: string;
  payload?: unknown;
}

/** Message sent from WebView → React Native */
export interface WebViewIncomingMessage {
  type: string;
  payload?: unknown;
}

/** Props shared by all WebView wrapper components */
export interface OrbWebViewProps {
  /** Base URL of the orbcafe-ui examples web server */
  baseUrl?: string;
  /** Test ID for the wrapper container */
  testID?: string;
  /** Callback when the WebView sends a message to React Native */
  onMessage?: (message: WebViewIncomingMessage) => void;
  /** Callback when the WebView finishes loading */
  onLoad?: () => void;
  /** Callback when the WebView encounters an error */
  onError?: (error: Error) => void;
}
