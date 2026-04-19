import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { BRAND_COLORS } from '../../config/foundations';

export interface MDividerProps {
  /** Orientation */
  direction?: 'horizontal' | 'vertical';
  /** Colour override */
  color?: string;
  /** Custom style */
  style?: ViewStyle;
}

export const MDivider: React.FC<MDividerProps> = ({
  direction = 'horizontal',
  color,
  style,
}) => (
  <View
    style={[
      direction === 'horizontal' ? styles.horizontal : styles.vertical,
      color ? { backgroundColor: color } : undefined,
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BRAND_COLORS.divider,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: BRAND_COLORS.divider,
    height: '100%',
  },
});
