import { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';

export type PadOrientation = 'portrait' | 'landscape';

export interface UsePadLayoutReturn {
  /** Current device orientation */
  orientation: PadOrientation;
  /** Screen width */
  width: number;
  /** Screen height */
  height: number;
  /** Whether the screen is wide enough to show a side panel */
  showSidePanel: boolean;
}

/**
 * Pad layout hook – detects orientation and provides layout hints for
 * adaptive pad interfaces.
 */
export function usePadLayout(sidePanelBreakpoint = 768): UsePadLayoutReturn {
  const { width, height } = useWindowDimensions();
  const orientation: PadOrientation = width >= height ? 'landscape' : 'portrait';
  const showSidePanel = width >= sidePanelBreakpoint;

  return { orientation, width, height, showSidePanel };
}
