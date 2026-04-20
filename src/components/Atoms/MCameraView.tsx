import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../config/foundations';

export interface MCameraViewProps {
  active?: boolean;
  aspectRatio?: number;
  children?: React.ReactNode;
  helperText?: string;
  overlay?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Camera viewport atom.
 *
 * This component intentionally does not bind to a specific native camera SDK.
 * Consumers can mount the actual native preview as `children`, while the atom
 * keeps framing, empty-state, and overlay behavior consistent.
 */
export function MCameraView({
  active = false,
  aspectRatio = 4 / 3,
  children,
  helperText = 'Camera preview',
  overlay,
  style,
  testID,
}: MCameraViewProps) {
  return (
    <View style={[styles.frame, { aspectRatio }, style]} testID={testID}>
      {active && children ? <View style={styles.previewFill}>{children}</View> : <View style={styles.placeholder}><Text style={styles.placeholderText}>{helperText}</Text></View>}
      {overlay ? <View pointerEvents="box-none" style={styles.overlay}>{overlay}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  previewFill: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: '#111827',
  },
  placeholderText: {
    color: '#E5E7EB',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
