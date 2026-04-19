/**
 * Manages the base URL of the orbcafe-ui web examples server that the
 * WebView bridge components connect to.
 *
 * Call `setOrbmobileBaseUrl()` once at app startup to configure the URL.
 */

let _baseUrl = 'http://localhost:3000';

/**
 * Set the base URL of the orbcafe-ui examples web server.
 *
 * @example
 * ```ts
 * import { setOrbmobileBaseUrl } from 'orbmobile-ui';
 * setOrbmobileBaseUrl('https://my-orbcafe-app.vercel.app');
 * ```
 */
export function setOrbmobileBaseUrl(url: string): void {
  // Remove a single trailing slash if present.
  _baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Get the currently configured base URL.
 */
export function getOrbmobileBaseUrl(): string {
  return _baseUrl;
}
