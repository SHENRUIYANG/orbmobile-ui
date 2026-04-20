import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../config/foundations';

export interface MTableToolbarAction {
  key: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export interface MTableSurfaceProps {
  resultCount: number;
  actions: MTableToolbarAction[];
  groupToggleIcon?: string;
  onGroupToggle?: () => void;
  children: React.ReactNode;
}

export function MTableSurface({ resultCount, actions, groupToggleIcon, onGroupToggle, children }: MTableSurfaceProps) {
  return (
    <View style={styles.section}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarRow}>
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.key}
                style={[styles.chipButton, styles.toolbarChip, action.active && styles.chipButtonActive]}
                onPress={action.onPress}
              >
                {action.active ? <View style={styles.chipDot} /> : null}
                <Text style={[styles.chipText, action.active && styles.chipTextActive]}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.meta}>
            <Text style={styles.countText}>{resultCount} 条</Text>
            {groupToggleIcon && onGroupToggle ? (
              <Pressable style={styles.iconButton} onPress={onGroupToggle}>
                <Text style={styles.iconButtonText}>{groupToggleIcon}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: SPACING.md,
    borderRadius: 30,
    backgroundColor: BRAND_COLORS.surface,
    borderWidth: 1,
    borderColor: '#E1E9F5',
    overflow: 'hidden',
  },
  toolbar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDF8',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexShrink: 0,
  },
  countText: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#DCE6F4',
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
});
