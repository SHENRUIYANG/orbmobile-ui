import React from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT } from '../../config/foundations';

export type MTypographyVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'body'
  | 'caption';

export interface MTypographyProps {
  /** Text variant */
  variant?: MTypographyVariant;
  /** Text content */
  children: React.ReactNode;
  /** Colour override */
  color?: string;
  /** Custom style */
  style?: TextStyle;
  /** Number of lines before truncation */
  numberOfLines?: number;
}

const variantStyles: Record<MTypographyVariant, TextStyle> = {
  display: {
    fontSize: FONT_SIZE.display,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.textPrimary,
  },
  headline: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.textPrimary,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: BRAND_COLORS.textPrimary,
  },
  body: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.normal,
    color: BRAND_COLORS.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.normal,
    color: BRAND_COLORS.textMuted,
  },
};

export const MTypography: React.FC<MTypographyProps> = ({
  variant = 'body',
  children,
  color,
  style,
  numberOfLines,
}) => (
  <Text
    style={[variantStyles[variant], color ? { color } : undefined, style]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);

const _styles = StyleSheet.create({}); // kept for future extensions
