import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING } from '../../config/foundations';

export type MChipVariant = 'filled' | 'outlined';

export interface MChipProps {
  /** Chip label */
  label: string;
  /** Visual variant */
  variant?: MChipVariant;
  /** Called when the chip is tapped */
  onPress?: () => void;
  /** Called when the close icon is tapped (renders an × when provided) */
  onClose?: () => void;
  /** Selected state */
  selected?: boolean;
  /** Accent colour override */
  color?: string;
  /** Custom container style */
  style?: ViewStyle;
}

export const MChip: React.FC<MChipProps> = ({
  label,
  variant = 'filled',
  onPress,
  onClose,
  selected = false,
  color,
  style,
}) => {
  const accentColor = color ?? BRAND_COLORS.accent;

  const containerStyle: ViewStyle =
    variant === 'filled'
      ? {
          backgroundColor: selected ? accentColor : BRAND_COLORS.divider,
        }
      : {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: selected ? accentColor : BRAND_COLORS.border,
        };

  const labelColor =
    variant === 'filled' && selected ? '#FFFFFF' : BRAND_COLORS.textPrimary;

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.chip, containerStyle, style]}
    >
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      {onClose ? (
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Text style={[styles.close, { color: labelColor }]}>×</Text>
        </TouchableOpacity>
      ) : null}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  close: {
    fontSize: FONT_SIZE.lg,
    lineHeight: FONT_SIZE.lg,
    fontWeight: '400',
  },
});
