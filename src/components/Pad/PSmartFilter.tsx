import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { BRAND_COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from '../../config/foundations';
import { useOrbmobileI18n } from '../../i18n';

export interface PSmartFilterField {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Filter type */
  type: 'text' | 'select';
  /** Available options for select type */
  options?: { label: string; value: string }[];
}

export interface PSmartFilterValues {
  [key: string]: string;
}

export interface PSmartFilterProps {
  /** Filter field definitions */
  fields: PSmartFilterField[];
  /** Current filter values */
  values?: PSmartFilterValues;
  /** Called when any filter value changes */
  onValuesChange?: (values: PSmartFilterValues) => void;
  /** Called when user presses the search/apply button */
  onApply?: (values: PSmartFilterValues) => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

/**
 * Touch-friendly filter bar for tablet / mobile scenarios.
 *
 * Renders filter fields as horizontally scrollable chips that expand into
 * input fields. Mirrors the orbcafe-ui `PSmartFilter` component.
 */
export const PSmartFilter: React.FC<PSmartFilterProps> = ({
  fields,
  values: controlledValues,
  onValuesChange,
  onApply,
  style,
  testID,
}) => {
  const { t } = useOrbmobileI18n();
  const [internalValues, setInternalValues] = useState<PSmartFilterValues>({});
  const values = controlledValues ?? internalValues;

  const updateValue = useCallback(
    (key: string, value: string) => {
      const next = { ...values, [key]: value };
      if (!controlledValues) setInternalValues(next);
      onValuesChange?.(next);
    },
    [values, controlledValues, onValuesChange],
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            {field.type === 'text' ? (
              <TextInput
                style={styles.fieldInput}
                value={values[field.key] ?? ''}
                onChangeText={(v) => updateValue(field.key, v)}
                placeholder={t('common.search')}
                placeholderTextColor={BRAND_COLORS.textMuted}
              />
            ) : (
              <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
                {field.options?.map((opt) => {
                  const selected = values[field.key] === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.option, selected && styles.optionSelected]}
                      onPress={() => updateValue(field.key, selected ? '' : opt.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          selected && styles.optionLabelSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>

      {onApply ? (
        <TouchableOpacity
          style={styles.applyButton}
          activeOpacity={0.7}
          onPress={() => onApply(values)}
        >
          <Text style={styles.applyLabel}>{t('common.search')}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  fieldCard: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    minWidth: 180,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
  },
  optionsContainer: {
    maxHeight: 120,
  },
  option: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  optionSelected: {
    backgroundColor: BRAND_COLORS.accent + '20',
  },
  optionLabel: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textPrimary,
  },
  optionLabelSelected: {
    color: BRAND_COLORS.accent,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: BRAND_COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignSelf: 'flex-end',
    marginHorizontal: SPACING.md,
  },
  applyLabel: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
