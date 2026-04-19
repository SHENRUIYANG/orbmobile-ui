import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type ListRenderItem,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from '../../config/foundations';
import { useOrbmobileI18n } from '../../i18n';

export interface PTableColumn {
  /** Unique column key (matches the data property name) */
  key: string;
  /** Column header label */
  label: string;
  /** Relative flex width (default: 1) */
  flex?: number;
}

export interface PTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Column definitions */
  columns: PTableColumn[];
  /** Row data array */
  data: T[];
  /** Unique key extractor */
  keyExtractor?: (item: T, index: number) => string;
  /** Called when a row is tapped */
  onRowPress?: (item: T, index: number) => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

/**
 * Touch-friendly card-style table for tablet / mobile scenarios.
 *
 * Each row is rendered as a rounded card so that touch targets are large and
 * comfortable. Mirrors the visual language of orbcafe-ui `PTable`.
 */
export function PTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  style,
  testID,
}: PTableProps<T>) {
  const { t } = useOrbmobileI18n();

  const renderRow: ListRenderItem<T> = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={onRowPress ? 0.7 : 1}
      onPress={() => onRowPress?.(item, index)}
    >
      {columns.map((col) => (
        <View key={col.key} style={[styles.cell, { flex: col.flex ?? 1 }]}>
          <Text style={styles.cellLabel}>{col.label}</Text>
          <Text style={styles.cellValue} numberOfLines={2}>
            {String(item[col.key] ?? '')}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={
          keyExtractor ??
          ((item, index) => (item['id'] != null ? String(item['id']) : String(index)))
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('common.noData')}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  card: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  cell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cellLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: BRAND_COLORS.textMuted,
    flex: 1,
  },
  cellValue: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    color: BRAND_COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.xxxl,
  },
});
