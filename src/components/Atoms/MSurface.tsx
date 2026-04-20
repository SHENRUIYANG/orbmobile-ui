import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BRAND_COLORS, RADIUS, SHADOWS, SPACING } from '../../config/foundations';

export interface MSurfaceProps {
  children: React.ReactNode;
  /** Elevation level */
  elevation?: 'sm' | 'md' | 'lg';
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

export const MSurface: React.FC<MSurfaceProps> = ({
  children,
  elevation = 'sm',
  style,
}) => (
  <View style={[styles.base, SHADOWS[elevation], style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
  },
});
