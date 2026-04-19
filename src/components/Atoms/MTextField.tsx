import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING } from '../../config/foundations';

export interface MTextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Field label displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error state – turns border / helper red */
  error?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
}

export const MTextField: React.FC<MTextFieldProps> = ({
  label,
  helperText,
  error = false,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? BRAND_COLORS.error
    : focused
      ? BRAND_COLORS.accent
      : BRAND_COLORS.border;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      ) : null}
      <TextInput
        style={[styles.input, { borderColor }, inputStyle]}
        placeholderTextColor={BRAND_COLORS.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {helperText ? (
        <Text style={[styles.helper, error && styles.helperError]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: BRAND_COLORS.textSecondary,
  },
  labelError: {
    color: BRAND_COLORS.error,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    backgroundColor: BRAND_COLORS.surface,
  },
  helper: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
  },
  helperError: {
    color: BRAND_COLORS.error,
  },
});
