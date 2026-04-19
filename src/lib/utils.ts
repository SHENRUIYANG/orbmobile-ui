/**
 * Utility helpers for orbmobile-ui.
 */

/**
 * Merge multiple style objects, filtering out falsy values.
 * React Native equivalent of the web `cn()` utility.
 */
export function mergeStyles<T extends Record<string, unknown>>(
  ...styles: (T | undefined | null | false)[]
): T {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
}
