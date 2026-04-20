import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS, SPACING } from '../../config/foundations';
import { MCameraView, type MCameraViewProps } from '../Atoms';

export interface MCameraPreviewPanelProps extends Pick<MCameraViewProps, 'active' | 'aspectRatio' | 'children' | 'helperText' | 'overlay' | 'testID'> {
  cameraStyle?: ViewStyle;
  title?: string;
  subtitle?: string;
  hint?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  style?: ViewStyle;
}

export function MCameraPreviewPanel({
  active,
  aspectRatio,
  children,
  helperText,
  overlay,
  testID,
  cameraStyle,
  title = 'Camera',
  subtitle = 'Live preview',
  hint,
  primaryActionLabel,
  onPrimaryAction,
  style,
}: MCameraPreviewPanelProps) {
  return (
    <View style={[styles.card, style]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {primaryActionLabel && onPrimaryAction ? (
          <Pressable style={styles.actionButton} onPress={onPrimaryAction}>
            <Text style={styles.actionLabel}>{primaryActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <MCameraView
        active={active}
        aspectRatio={aspectRatio}
        helperText={helperText}
        overlay={overlay}
        style={cameraStyle}
      >
        {children}
      </MCameraView>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    backgroundColor: BRAND_COLORS.surface,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: BRAND_COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textSecondary,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    backgroundColor: BRAND_COLORS.surface,
  },
  actionLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: BRAND_COLORS.textPrimary,
  },
  hint: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textMuted,
  },
});
