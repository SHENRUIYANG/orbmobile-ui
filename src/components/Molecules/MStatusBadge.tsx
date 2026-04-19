import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING } from '../../config/foundations';

export type MStatusBadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface MStatusBadgeProps {
  /** Badge label */
  label: string;
  /** Status */
  status?: MStatusBadgeStatus;
  /** Custom style */
  style?: ViewStyle;
}

const STATUS_COLORS: Record<MStatusBadgeStatus, { bg: string; text: string }> = {
  success: { bg: '#DCFCE7', text: '#166534' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
  neutral: { bg: BRAND_COLORS.divider, text: BRAND_COLORS.textSecondary },
};

export const MStatusBadge: React.FC<MStatusBadgeProps> = ({
  label,
  status = 'neutral',
  style,
}) => {
  const { bg, text } = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
