import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  type ViewStyle,
  SafeAreaView,
} from 'react-native';
import { BRAND_COLORS, FONT_SIZE, SPACING, SHADOWS, RADIUS } from '../../config/foundations';

export interface PWorkloadItem {
  /** Unique key */
  id: string;
  /** Card title */
  title: string;
  /** Card count / value */
  value: string | number;
  /** Accent colour */
  color?: string;
}

export interface PadDemoProps {
  /** Test ID */
  testID?: string;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Pad Demo screen — a self-contained tablet cockpit layout that demonstrates
 * the key pad components (workload cards, touch table, numeric keypad).
 *
 * This mirrors the orbcafe-ui `/pad` example but is implemented entirely
 * with React Native components.
 */
export const PadDemo: React.FC<PadDemoProps> = ({ testID, style }) => {
  const workloadItems: PWorkloadItem[] = [
    { id: '1', title: 'Pending', value: 12, color: BRAND_COLORS.warning },
    { id: '2', title: 'In Progress', value: 8, color: BRAND_COLORS.accent },
    { id: '3', title: 'Completed', value: 45, color: BRAND_COLORS.success },
    { id: '4', title: 'Errors', value: 2, color: BRAND_COLORS.error },
  ];

  return (
    <SafeAreaView style={[styles.safe, style]} testID={testID}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pad Cockpit</Text>
        <Text style={styles.headerSubtitle}>Touch-optimized warehouse view</Text>
      </View>

      {/* Workload cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.workloadRow}
      >
        {workloadItems.map((item) => (
          <View key={item.id} style={[styles.workloadCard, SHADOWS.sm]}>
            <View
              style={[
                styles.workloadDot,
                { backgroundColor: item.color ?? BRAND_COLORS.accent },
              ]}
            />
            <Text style={styles.workloadValue}>{item.value}</Text>
            <Text style={styles.workloadTitle}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Placeholder content area */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          This demo showcases the Pad layout shell. Combine with{' '}
          <Text style={styles.code}>PTable</Text>,{' '}
          <Text style={styles.code}>PSmartFilter</Text>, and{' '}
          <Text style={styles.code}>PNumericKeypad</Text> to build a full
          warehouse cockpit.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  workloadRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  workloadCard: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    minWidth: 130,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  workloadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: SPACING.xs,
  },
  workloadValue: {
    fontSize: 28,
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
  },
  workloadTitle: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  code: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: BRAND_COLORS.accent,
  },
});
