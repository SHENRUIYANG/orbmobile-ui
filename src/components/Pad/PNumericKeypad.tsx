import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from '../../config/foundations';

export interface PNumericKeypadProps {
  /** Called with the current accumulated value whenever a key is pressed */
  onValueChange?: (value: string) => void;
  /** Called when the user presses Enter / ✓ */
  onSubmit?: (value: string) => void;
  /** Initial value */
  initialValue?: string;
  /** Max input length */
  maxLength?: number;
  /** Allow decimal point */
  allowDecimal?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
];

/**
 * Touch-friendly numeric keypad for tablet/mobile data-entry scenarios.
 *
 * Mirrors the orbcafe-ui `PNumericKeypad` component but is implemented as a
 * pure React Native component with large touch targets.
 */
export const PNumericKeypad: React.FC<PNumericKeypadProps> = ({
  onValueChange,
  onSubmit,
  initialValue = '',
  maxLength = 12,
  allowDecimal = true,
  style,
  testID,
}) => {
  const [value, setValue] = useState(initialValue);

  const handlePress = useCallback(
    (key: string) => {
      let next = value;

      if (key === '⌫') {
        next = value.slice(0, -1);
      } else if (key === '.') {
        if (!allowDecimal || value.includes('.')) return;
        next = value + '.';
      } else {
        if (value.length >= maxLength) return;
        next = value + key;
      }

      setValue(next);
      onValueChange?.(next);
    },
    [value, maxLength, allowDecimal, onValueChange],
  );

  const handleClear = useCallback(() => {
    setValue('');
    onValueChange?.('');
  }, [onValueChange]);

  const handleSubmit = useCallback(() => {
    onSubmit?.(value);
  }, [value, onSubmit]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Display */}
      <View style={styles.display}>
        <Text
          style={styles.displayText}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value || '0'}
        </Text>
      </View>

      {/* Keys */}
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                key === '⌫' && styles.deleteKey,
              ]}
              activeOpacity={0.6}
              onPress={() => handlePress(key)}
            >
              <Text
                style={[
                  styles.keyLabel,
                  key === '⌫' && styles.deleteKeyLabel,
                ]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Bottom actions */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.key, styles.clearKey]}
          activeOpacity={0.6}
          onPress={handleClear}
        >
          <Text style={styles.clearKeyLabel}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.key, styles.submitKey, { flex: 2 }]}
          activeOpacity={0.7}
          onPress={handleSubmit}
        >
          <Text style={styles.submitKeyLabel}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xxl,
    ...SHADOWS.md,
  },
  display: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  displayText: {
    fontSize: 36,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  key: {
    flex: 1,
    aspectRatio: 1.6,
    backgroundColor: BRAND_COLORS.background,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyLabel: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
    color: BRAND_COLORS.textPrimary,
  },
  deleteKey: {
    backgroundColor: '#FEE2E2',
  },
  deleteKeyLabel: {
    color: BRAND_COLORS.error,
  },
  clearKey: {
    backgroundColor: BRAND_COLORS.divider,
  },
  clearKeyLabel: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
    color: BRAND_COLORS.textSecondary,
  },
  submitKey: {
    backgroundColor: BRAND_COLORS.accent,
  },
  submitKeyLabel: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
