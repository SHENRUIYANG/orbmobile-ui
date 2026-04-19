import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING } from '../../config/foundations';

export type MButtonVariant = 'contained' | 'outlined' | 'text';
export type MButtonSize = 'small' | 'medium' | 'large';

export interface MButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button label */
  children: React.ReactNode;
  /** Visual variant */
  variant?: MButtonVariant;
  /** Size preset */
  size?: MButtonSize;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Accent colour override */
  color?: string;
}

export const MButton: React.FC<MButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  loading = false,
  disabled,
  style,
  labelStyle,
  color,
  ...rest
}) => {
  const isDisabled = disabled || loading;
  const accentColor = color ?? BRAND_COLORS.primary;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantContainer(variant, accentColor),
    isDisabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.label,
    sizeLabelStyles[size],
    variantLabel(variant, accentColor),
    isDisabled && styles.disabledLabel,
    labelStyle as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={containerStyles}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'contained' ? '#FFFFFF' : accentColor}
        />
      ) : typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

function variantContainer(variant: MButtonVariant, color: string): ViewStyle {
  switch (variant) {
    case 'contained':
      return { backgroundColor: color };
    case 'outlined':
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: color };
    case 'text':
      return { backgroundColor: 'transparent' };
  }
}

function variantLabel(variant: MButtonVariant, color: string): TextStyle {
  switch (variant) {
    case 'contained':
      return { color: '#FFFFFF' };
    case 'outlined':
    case 'text':
      return { color };
  }
}

const sizeStyles: Record<MButtonSize, ViewStyle> = {
  small: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.sm },
  medium: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.md },
  large: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
};

const sizeLabelStyles: Record<MButtonSize, TextStyle> = {
  small: { fontSize: FONT_SIZE.sm },
  medium: { fontSize: FONT_SIZE.md },
  large: { fontSize: FONT_SIZE.lg },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  disabledLabel: {
    opacity: 0.6,
  },
});
