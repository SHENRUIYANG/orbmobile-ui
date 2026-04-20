import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS, SPACING } from '../../config/foundations';
import { useSmartFilterLayout } from './hooks/useSmartFilterLayout';
import type { FilterField, FilterValues } from '../StdReport/types';

export interface MSmartFilterPanelProps {
  fields: FilterField[];
  values: FilterValues;
  summaryText: string;
  collapsed: boolean;
  width: number;
  height: number;
  activeVariantName?: string | null;
  activeFilterCount?: number;
  onVariantPress?: () => void;
  onToggleCollapsed: () => void;
  onClear?: () => void;
  onFieldEdit?: (field: FilterField) => void;
  onFieldValueChange: (field: FilterField, value: string) => void;
}

export function MSmartFilterPanel({
  fields,
  values,
  summaryText,
  collapsed,
  width,
  height,
  activeVariantName,
  activeFilterCount = 0,
  onVariantPress,
  onToggleCollapsed,
  onClear,
  onFieldEdit,
  onFieldValueChange,
}: MSmartFilterPanelProps) {
  const visibleFields = fields.filter((field) => !field.hidden);
  const { filterCardWidth, filterColumnCount } = useSmartFilterLayout(width);
  const compactListLayout = filterColumnCount === 1;
  const denseGridLayout = filterColumnCount >= 2;
  const maxVisibleRows = 3;
  const needsInternalScroll = visibleFields.length > filterColumnCount * maxVisibleRows;
  const compactVisibleHeight = 188;
  const gridVisibleHeight = 320;
  const maxPanelHeight = Math.min(Math.floor(height * 0.4), compactListLayout ? compactVisibleHeight : gridVisibleHeight);

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.toolbarTop}>
        <View style={styles.toolbarLead}>
          <Pressable
            style={[styles.chipButton, styles.toolbarChip, activeVariantName && styles.chipButtonActive]}
            onPress={onVariantPress}
          >
            {activeVariantName ? <View style={styles.chipDot} /> : null}
            <Text style={[styles.chipText, activeVariantName && styles.chipTextActive]}>{activeVariantName ?? 'Variant'}</Text>
          </Pressable>

          <Text numberOfLines={1} style={styles.summaryText}>{summaryText}</Text>
        </View>

        <View style={styles.toolbarActions}>
          {activeFilterCount > 0 && onClear ? (
            <Pressable style={styles.iconButton} onPress={onClear}>
              <Text style={styles.iconButtonText}>×</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.iconButton} onPress={onToggleCollapsed}>
            <Text style={styles.iconButtonText}>{collapsed ? '▾' : '▴'}</Text>
          </Pressable>
        </View>
      </View>

      {!collapsed ? (
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={needsInternalScroll}
          style={[styles.gridScroll, needsInternalScroll && { maxHeight: maxPanelHeight }]}
          contentContainerStyle={compactListLayout ? styles.listStack : styles.grid}
        >
          {visibleFields.map((field) => (
            <View
              key={field.id}
              style={
                compactListLayout
                  ? styles.listRow
                  : [styles.card, denseGridLayout && styles.gridCardDense, { width: filterCardWidth }]
              }
            > 
              <View style={styles.cardHeader}>
                <Text style={styles.label}>{field.label}</Text>
                <Pressable style={styles.fieldAction} onPress={() => onFieldEdit?.(field)}>
                  <Text style={styles.fieldActionText}>⋯</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder ?? 'Filter'}
                placeholderTextColor={BRAND_COLORS.textMuted}
                value={Array.isArray(values[field.id]?.value) ? '' : String(values[field.id]?.value ?? '')}
                onChangeText={(value) => onFieldValueChange(field, value)}
              />
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 10,
    marginBottom: SPACING.lg,
    borderRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: '#F6F9FF',
    borderWidth: 1,
    borderColor: '#E1E9F5',
    gap: SPACING.md,
  },
  toolbarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  toolbarLead: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minWidth: 0,
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  summaryText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textSecondary,
    lineHeight: 16,
  },
  iconButton: {
    backgroundColor: BRAND_COLORS.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  iconButtonText: {
    color: BRAND_COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  chipButton: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  toolbarChip: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_COLORS.primary,
  },
  chipButtonActive: {
    backgroundColor: '#EAF2FF',
    borderColor: '#BFD4F7',
  },
  chipText: {
    color: BRAND_COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  chipTextActive: {
    color: BRAND_COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingRight: 2,
  },
  listStack: {
    gap: SPACING.sm,
    paddingRight: 2,
  },
  gridScroll: {
    flexGrow: 0,
  },
  card: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minWidth: 140,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  gridCardDense: {
    paddingVertical: 10,
    minHeight: 90,
    gap: 6,
  },
  listRow: {
    gap: 6,
    paddingVertical: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  fieldAction: {
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  fieldActionText: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.accent,
    fontWeight: FONT_WEIGHT.medium,
  },
  input: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
  },
});
