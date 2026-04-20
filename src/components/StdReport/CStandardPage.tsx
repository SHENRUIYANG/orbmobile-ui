import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BRAND_COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS, SPACING } from '../../config/foundations';
import { MSmartFilterPanel, MTableSurface } from '../Molecules';
import { usePadLayout } from '../Pad/Hooks/usePadLayout';
import type {
  FilterField,
  FilterOperator,
  FilterValue,
  MStandardPageProps,
  StandardReportRowData,
} from './types';
import { getDefaultOperator, formatValue, useStandardReport, type StandardReportListEntry } from './Hooks';

const PAGE_SIZE_DEFAULT = 8;

const getOperators = (field: FilterField): FilterOperator[] => {
  if (field.type === 'number') {
    return ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'notEquals'];
  }
  if (field.type === 'select' || field.type === 'multi-select') {
    return ['equals', 'notEquals'];
  }
  return ['contains', 'equals', 'startsWith', 'endsWith', 'notContains'];
};

export function MStandardPage({
  testID,
  appId = 'orbmobile-ui',
  tableKey = 'standard-report',
  title = 'Standard Report',
  columns = [],
  filters = [],
  data = [],
  pageSize = PAGE_SIZE_DEFAULT,
  onRowPress,
  onFilterChange,
}: MStandardPageProps) {
  const { width, height } = usePadLayout();
  const [showVariantPicker, setShowVariantPicker] = useState(false);
  const [showVariantSave, setShowVariantSave] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showLayoutSave, setShowLayoutSave] = useState(false);
  const [showFilterEditor, setShowFilterEditor] = useState(false);
  const [showGroupingPicker, setShowGroupingPicker] = useState(false);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [editingFilterField, setEditingFilterField] = useState<FilterField | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saveIsDefault, setSaveIsDefault] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const {
    filterValues,
    updateFilters,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    setLoadedPages,
    layoutColumns,
    variants,
    layouts,
    activeVariantId,
    activeLayoutId,
    activeVariant,
    activeLayout,
    groupByKey,
    collapsedGroupKeys,
    setCollapsedGroupKeys,
    visibleColumns,
    sortableColumns,
    groupableColumns,
    filteredRows,
    visibleRows,
    hasMorePages,
    activeGroupColumn,
    activeFilterCount,
    activeFilterSummary,
    clearFilters,
    clearSort,
    handleGroupByChange,
    toggleGroupCollapsed,
    handleSaveVariant,
    handleApplyVariant,
    handleDeleteVariant,
    handleSetDefaultVariant,
    handleSaveLayout,
    handleApplyLayout,
    handleDeleteLayout,
    handleSetDefaultLayout,
    toggleColumnVisibility,
    groupSections,
    allGroupsCollapsed,
    listEntries,
  } = useStandardReport({
    appId,
    tableKey,
    columns,
    filters,
    data,
    pageSize,
    onFilterChange,
  });

  const layoutConfigured = Boolean(activeLayout) || visibleColumns.length !== columns.length;

  const handleInlineFilterChange = useCallback(
    (field: FilterField, value: string) => {
      updateFilters({
        ...filterValues,
        [field.id]: {
          value,
          operator: filterValues[field.id]?.operator ?? getDefaultOperator(field),
          valueTo: filterValues[field.id]?.valueTo,
        },
      });
    },
    [filterValues, updateFilters],
  );

  const renderCard = useCallback(
    (item: StandardReportRowData) => {
      const [primaryColumn, secondaryColumn, ...detailColumns] = visibleColumns;
      const statusColumn = visibleColumns.find((column) => /status/i.test(column.key));
      const amountColumn = visibleColumns.find((column) => /amount|total|price|cost/i.test(column.key));
      const compactTileLayout = width < 768;
      const detailTileStyle = compactTileLayout ? styles.detailTileCompact : styles.detailTileRegular;
      const primaryValue = primaryColumn ? formatValue(primaryColumn.key, item[primaryColumn.key]) : '—';
      const secondaryValue = secondaryColumn ? formatValue(secondaryColumn.key, item[secondaryColumn.key]) : '';
      const statusValue = statusColumn ? formatValue(statusColumn.key, item[statusColumn.key]) : null;
      const amountValue = amountColumn ? formatValue(amountColumn.key, item[amountColumn.key]) : null;
      const tiles = detailColumns.filter((column) => column.key !== statusColumn?.key && column.key !== amountColumn?.key);

      return (
        <Pressable style={styles.recordCard} onPress={() => onRowPress?.(item)}>
          <View style={styles.recordHeader}>
            {primaryColumn ? <Text style={styles.recordEyebrow}>{primaryColumn.label}</Text> : null}
            <Text style={styles.recordTitle} numberOfLines={1}>{primaryValue}</Text>
            {secondaryColumn ? (
              <Text style={styles.recordSubtitle} numberOfLines={1}>
                {secondaryColumn.label}: {secondaryValue}
              </Text>
            ) : null}
          </View>

          <View style={styles.magnetGrid}>
            {statusValue ? (
              <View style={[styles.metaMagnet, styles.metaMagnetFlow, detailTileStyle, styles.statusMagnet]}>
                <Text style={styles.metaLabel}>{statusColumn?.label}</Text>
                <Text style={styles.metaValue}>{statusValue}</Text>
              </View>
            ) : null}
            {amountValue ? (
              <View style={[styles.metaMagnet, styles.metaMagnetFlow, detailTileStyle, styles.amountMagnet]}>
                <Text style={styles.metaLabel}>{amountColumn?.label}</Text>
                <Text style={styles.amountValue}>{amountValue}</Text>
              </View>
            ) : null}
            {tiles.map((column) => (
              <View key={column.key} style={[styles.fieldMagnet, detailTileStyle]}>
                <Text style={styles.fieldMagnetLabel}>{column.label}</Text>
                <Text style={styles.fieldMagnetValue} numberOfLines={2}>
                  {formatValue(column.key, item[column.key])}
                </Text>
              </View>
            ))}
          </View>
        </Pressable>
      );
    },
    [onRowPress, visibleColumns],
  );

  const renderListItem = useCallback(
    ({ item }: { item: StandardReportListEntry }) => {
      if (item.type === 'group') {
        const collapsed = collapsedGroupKeys.includes(item.section.key);
        return (
          <Pressable style={styles.groupHeaderCard} onPress={() => toggleGroupCollapsed(item.section.key)}>
            <View style={styles.groupHeaderCopy}>
              <Text style={styles.groupHeaderEyebrow}>{activeGroupColumn?.label ?? '分组'}</Text>
              <Text style={styles.groupHeaderTitle}>{item.section.label}</Text>
            </View>
            <View style={styles.groupHeaderMeta}>
              <View style={styles.groupHeaderCountBadge}>
                <Text style={styles.groupHeaderCount}>{item.section.rowCount}</Text>
              </View>
              <Text style={styles.groupHeaderToggle}>{collapsed ? '▾' : '▴'}</Text>
            </View>
          </Pressable>
        );
      }

      return renderCard(item.row);
    },
    [activeGroupColumn?.label, collapsedGroupKeys, renderCard, toggleGroupCollapsed],
  );

  const filterFields = filters.filter((field) => !field.hidden);
  const filterSummaryText = activeFilterCount > 0 ? activeFilterSummary : 'All records';

  return (
    <SafeAreaView style={styles.root} testID={testID}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {filterFields.length > 0 ? (
        <MSmartFilterPanel
          fields={filterFields}
          values={filterValues}
          summaryText={filterSummaryText}
          collapsed={filtersCollapsed}
          width={width}
          height={height}
          activeVariantName={activeVariant?.name ?? null}
          activeFilterCount={activeFilterCount}
          onVariantPress={() => setShowVariantPicker(true)}
          onToggleCollapsed={() => setFiltersCollapsed((current) => !current)}
          onClear={clearFilters}
          onFieldEdit={(field) => {
            setEditingFilterField(field);
            setShowFilterEditor(true);
          }}
          onFieldValueChange={handleInlineFilterChange}
        />
      ) : null}

      <MTableSurface
        resultCount={filteredRows.length}
        actions={[
          { key: 'layout', label: 'Layout', active: layoutConfigured, onPress: () => setShowLayoutPicker(true) },
          { key: 'group', label: 'Group', active: Boolean(groupByKey), onPress: () => setShowGroupingPicker(true) },
          ...(sortableColumns.length > 0 ? [{ key: 'sort', label: 'Sort', active: Boolean(sortKey), onPress: () => setShowSortPicker(true) }] : []),
        ]}
        groupToggleIcon={groupByKey ? (allGroupsCollapsed ? '+' : '−') : undefined}
        onGroupToggle={
          groupByKey
            ? () => setCollapsedGroupKeys(allGroupsCollapsed ? [] : groupSections.map((section) => section.key))
            : undefined
        }
      >

        <FlatList
          data={listEntries}
          keyExtractor={(item) => item.key}
          renderItem={renderListItem}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasMorePages) {
              setLoadedPages((current) => current + 1);
            }
          }}
          onEndReachedThreshold={0.35}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No rows found</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footerHintWrap}>
              <Text style={styles.footerHintText}>
                {hasMorePages
                  ? `继续上滑加载更多 · ${visibleRows.length}/${filteredRows.length}`
                  : `已显示全部 ${filteredRows.length} 条`}
              </Text>
            </View>
          }
        />
      </MTableSurface>

      <BottomSheet visible={showGroupingPicker} onClose={() => setShowGroupingPicker(false)} title="Group By">
        <Text style={styles.modalHint}>选择一个字段，将卡片按组显示并支持组头折叠。</Text>
        <Pressable
          style={[styles.modalChoiceItem, !groupByKey && styles.modalChoiceItemActive]}
          onPress={() => {
            handleGroupByChange(null);
            setShowGroupingPicker(false);
          }}
        >
          <Text style={[styles.modalChoiceText, !groupByKey && styles.modalChoiceTextActive]}>不分组</Text>
        </Pressable>
        {groupableColumns.map((column) => {
          const active = groupByKey === column.key;
          return (
            <Pressable
              key={column.key}
              style={[styles.modalChoiceItem, active && styles.modalChoiceItemActive]}
              onPress={() => {
                handleGroupByChange(column.key);
                setShowGroupingPicker(false);
              }}
            >
              <Text style={[styles.modalChoiceText, active && styles.modalChoiceTextActive]}>{column.label}</Text>
            </Pressable>
          );
        })}

        {groupByKey ? (
          <View style={styles.groupingPickerActions}>
            <Pressable style={styles.sectionPillButton} onPress={() => setCollapsedGroupKeys([])}>
              <Text style={styles.sectionPillButtonText}>全部展开</Text>
            </Pressable>
            <Pressable
              style={styles.sectionPillButton}
              onPress={() => setCollapsedGroupKeys(groupSections.map((section) => section.key))}
            >
              <Text style={styles.sectionPillButtonText}>全部折叠</Text>
            </Pressable>
          </View>
        ) : null}
      </BottomSheet>

      <BottomSheet visible={showSortPicker} onClose={() => setShowSortPicker(false)} title="Sort">
        <Text style={styles.modalHint}>选择一个排序字段，再设置升序或降序。排序属于 table 视图，不与 SmartFilter 混排。</Text>
        <Pressable
          style={[styles.modalChoiceItem, !sortKey && styles.modalChoiceItemActive]}
          onPress={() => {
            clearSort();
            setShowSortPicker(false);
          }}
        >
          <Text style={[styles.modalChoiceText, !sortKey && styles.modalChoiceTextActive]}>默认顺序</Text>
        </Pressable>
        {sortableColumns.map((column) => {
          const active = sortKey === column.key;
          return (
            <View key={column.key} style={styles.sortChoiceGroup}>
              <Text style={styles.sortChoiceTitle}>{column.label}</Text>
              <View style={styles.sortChoiceActions}>
                <Pressable
                  style={[styles.sectionPillButton, active && sortAsc && styles.sectionPillButtonActive]}
                  onPress={() => {
                    setSortKey(column.key);
                    setSortAsc(true);
                    setLoadedPages(1);
                    setShowSortPicker(false);
                  }}
                >
                  <Text style={[styles.sectionPillButtonText, active && sortAsc && styles.sectionPillButtonTextActive]}>升序</Text>
                </Pressable>
                <Pressable
                  style={[styles.sectionPillButton, active && !sortAsc && styles.sectionPillButtonActive]}
                  onPress={() => {
                    setSortKey(column.key);
                    setSortAsc(false);
                    setLoadedPages(1);
                    setShowSortPicker(false);
                  }}
                >
                  <Text style={[styles.sectionPillButtonText, active && !sortAsc && styles.sectionPillButtonTextActive]}>降序</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </BottomSheet>

      <BottomSheet visible={showVariantPicker} onClose={() => setShowVariantPicker(false)} title="Variants">
        {variants.length === 0 && <Text style={styles.modalHint}>No saved variants</Text>}
        {variants.map((variant) => (
          <View key={variant.id} style={styles.modalListItem}>
            <Pressable style={styles.modalListMain} onPress={() => handleApplyVariant(variant)}>
              <Text style={[styles.modalListText, activeVariantId === variant.id && styles.modalListTextActive]}>
                {variant.name}
                {variant.isDefault ? ' ★' : ''}
              </Text>
            </Pressable>
            <Pressable onPress={() => void handleSetDefaultVariant(variant.id)}>
              <Text style={styles.linkText}>Default</Text>
            </Pressable>
            <Pressable onPress={() => void handleDeleteVariant(variant.id)}>
              <Text style={[styles.linkText, styles.linkDanger]}>Delete</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setShowVariantPicker(false);
            setSaveName('');
            setSaveIsDefault(false);
            setShowVariantSave(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Save Current Variant</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet visible={showVariantSave} onClose={() => setShowVariantSave(false)} title="Save Variant">
        <Text style={styles.modalLabel}>Name</Text>
        <TextInput style={styles.modalInput} value={saveName} onChangeText={setSaveName} placeholder="Variant name" />
        <View style={styles.switchRow}>
          <Text style={styles.modalLabel}>Set as default</Text>
          <Switch value={saveIsDefault} onValueChange={setSaveIsDefault} />
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            void handleSaveVariant(saveName, saveIsDefault);
            setShowVariantSave(false);
            setSaveName('');
            setSaveIsDefault(false);
          }}
        >
          <Text style={styles.primaryButtonText}>Save</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet visible={showLayoutPicker} onClose={() => setShowLayoutPicker(false)} title="Layout">
        <Text style={styles.modalSectionTitle}>Columns</Text>
        {columns.map((column) => {
          const config = layoutColumns.find((item) => item.key === column.key);
          return (
            <View key={column.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{column.label}</Text>
              <Switch value={config?.visible ?? true} onValueChange={() => toggleColumnVisibility(column.key)} />
            </View>
          );
        })}
        <View style={styles.modalDivider} />
        <Text style={styles.modalSectionTitle}>Saved layouts</Text>
        {layouts.length === 0 && <Text style={styles.modalHint}>No saved layouts</Text>}
        {layouts.map((layout) => (
          <View key={layout.id} style={styles.modalListItem}>
            <Pressable style={styles.modalListMain} onPress={() => handleApplyLayout(layout)}>
              <Text style={[styles.modalListText, activeLayoutId === layout.id && styles.modalListTextActive]}>
                {layout.name}
                {layout.isDefault ? ' ★' : ''}
              </Text>
            </Pressable>
            <Pressable onPress={() => void handleSetDefaultLayout(layout.id)}>
              <Text style={styles.linkText}>Default</Text>
            </Pressable>
            <Pressable onPress={() => void handleDeleteLayout(layout.id)}>
              <Text style={[styles.linkText, styles.linkDanger]}>Delete</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setShowLayoutPicker(false);
            setSaveName('');
            setSaveIsDefault(false);
            setShowLayoutSave(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Save Current Layout</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet visible={showLayoutSave} onClose={() => setShowLayoutSave(false)} title="Save Layout">
        <Text style={styles.modalLabel}>Name</Text>
        <TextInput style={styles.modalInput} value={saveName} onChangeText={setSaveName} placeholder="Layout name" />
        <View style={styles.switchRow}>
          <Text style={styles.modalLabel}>Set as default</Text>
          <Switch value={saveIsDefault} onValueChange={setSaveIsDefault} />
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            void handleSaveLayout(saveName, saveIsDefault);
            setShowLayoutSave(false);
            setSaveName('');
            setSaveIsDefault(false);
          }}
        >
          <Text style={styles.primaryButtonText}>Save</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet
        visible={showFilterEditor}
        onClose={() => {
          setShowFilterEditor(false);
          setEditingFilterField(null);
        }}
        title={editingFilterField ? `Filter: ${editingFilterField.label}` : 'Filter'}
      >
        {editingFilterField && (
          <FilterEditor
            field={editingFilterField}
            value={filterValues[editingFilterField.id]}
            onChange={(value) => {
              updateFilters({
                ...filterValues,
                [editingFilterField.id]: value,
              });
            }}
          />
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

function BottomSheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FilterEditor({ field, value, onChange }: { field: FilterField; value?: FilterValue; onChange: (value: FilterValue) => void }) {
  const operators = getOperators(field);
  const [operator, setOperator] = useState<FilterOperator>(value?.operator ?? getDefaultOperator(field));
  const [textValue, setTextValue] = useState(Array.isArray(value?.value) ? '' : String(value?.value ?? ''));
  const [multiValue, setMultiValue] = useState<string[]>(Array.isArray(value?.value) ? value.value : []);
  const [valueTo, setValueTo] = useState(String(value?.valueTo ?? ''));

  useEffect(() => {
    setOperator(value?.operator ?? getDefaultOperator(field));
    setTextValue(Array.isArray(value?.value) ? '' : String(value?.value ?? ''));
    setMultiValue(Array.isArray(value?.value) ? value.value : []);
    setValueTo(String(value?.valueTo ?? ''));
  }, [field, value]);

  const emitValue = useCallback(
    (nextOperator: FilterOperator, nextValue: string | string[], nextValueTo?: string) => {
      onChange({ value: nextValue, operator: nextOperator, valueTo: nextValueTo });
    },
    [onChange],
  );

  const options = field.options ?? [];

  return (
    <View>
      <Text style={styles.modalLabel}>Operator</Text>
      <View style={styles.operatorRow}>
        {operators.map((item) => (
          <Pressable
            key={item}
            style={[styles.operatorChip, item === operator && styles.operatorChipActive]}
            onPress={() => {
              setOperator(item);
              emitValue(item, field.type === 'multi-select' ? multiValue : textValue, valueTo);
            }}
          >
            <Text style={[styles.operatorChipText, item === operator && styles.operatorChipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {field.type === 'multi-select' && options.length > 0 ? (
        <View>
          <Text style={styles.modalLabel}>Values</Text>
          <View style={styles.optionWrap}>
            {options.map((option) => {
              const selected = multiValue.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionChip, selected && styles.optionChipActive]}
                  onPress={() => {
                    const next = selected ? multiValue.filter((item) => item !== option.value) : [...multiValue, option.value];
                    setMultiValue(next);
                    emitValue(operator, next, valueTo);
                  }}
                >
                  <Text style={[styles.optionChipText, selected && styles.optionChipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : field.type === 'select' && options.length > 0 ? (
        <View>
          <Text style={styles.modalLabel}>Value</Text>
          <View style={styles.optionWrap}>
            {options.map((option) => {
              const selected = textValue === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionChip, selected && styles.optionChipActive]}
                  onPress={() => {
                    setTextValue(option.value);
                    emitValue(operator, option.value, valueTo);
                  }}
                >
                  <Text style={[styles.optionChipText, selected && styles.optionChipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.modalLabel}>Value</Text>
          <TextInput
            style={styles.modalInput}
            value={textValue}
            onChangeText={(next) => {
              setTextValue(next);
              emitValue(operator, next, valueTo);
            }}
            placeholder={field.placeholder ?? 'Enter value'}
          />
          {field.type === 'number' && operator === 'between' && (
            <>
              <Text style={styles.modalLabel}>To</Text>
              <TextInput
                style={styles.modalInput}
                value={valueTo}
                onChangeText={(next) => {
                  setValueTo(next);
                  emitValue(operator, textValue, next);
                }}
                placeholder="Upper bound"
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND_COLORS.background },
  header: {
    paddingHorizontal: 10,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: BRAND_COLORS.background,
    gap: SPACING.sm,
  },
  headerCopy: { gap: SPACING.xs },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: BRAND_COLORS.textPrimary },
  smartFilterSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    borderRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: '#F6F9FF',
    borderWidth: 1,
    borderColor: '#E1E9F5',
    gap: SPACING.md,
  },
  filterToolbar: {
    gap: SPACING.sm,
  },
  filterToolbarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  filterSummaryText: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textSecondary,
    paddingHorizontal: 2,
  },
  filterToolbarActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
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
  chipText: { color: BRAND_COLORS.textPrimary, fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },
  chipTextActive: { color: BRAND_COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterCard: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minWidth: 140,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  filterCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterLabel: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.semibold,
  },
  filterAction: { paddingHorizontal: SPACING.xs, paddingVertical: 2 },
  filterActionText: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.accent, fontWeight: FONT_WEIGHT.medium },
  filterInput: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  tableSection: {
    flex: 1,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    borderRadius: 30,
    backgroundColor: BRAND_COLORS.surface,
    borderWidth: 1,
    borderColor: '#E1E9F5',
    overflow: 'hidden',
  },
  tableToolbar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDF8',
  },
  tableToolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  tableToolbarActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  tableToolbarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexShrink: 0,
  },
  tableToolbarSubline: {
    paddingTop: SPACING.sm,
    paddingHorizontal: 2,
  },
  tableCountText: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textMuted,
    fontWeight: FONT_WEIGHT.medium,
  },
  toolbarIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#DCE6F4',
  },
  sectionPillButton: {
    backgroundColor: BRAND_COLORS.surface,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionPillButtonText: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  sectionPillButtonActive: {
    backgroundColor: BRAND_COLORS.primary,
    borderColor: BRAND_COLORS.primary,
  },
  sectionPillButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: { paddingHorizontal: 10, paddingBottom: SPACING.xxxl, gap: SPACING.md },
  groupHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAF1FF',
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: '#D7E4FB',
  },
  groupHeaderCopy: { flex: 1, gap: 2 },
  groupHeaderEyebrow: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.semibold,
  },
  groupHeaderTitle: {
    fontSize: FONT_SIZE.lg,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  groupHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  groupHeaderCountBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: '#CFE0FC',
  },
  groupHeaderCount: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  groupHeaderToggle: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  recordCard: {
    backgroundColor: BRAND_COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  recordHeader: {
    gap: SPACING.xs,
  },
  recordEyebrow: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.semibold,
  },
  recordTitle: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: BRAND_COLORS.textPrimary },
  recordSubtitle: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.textSecondary },
  metaMagnet: {
    minWidth: 112,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 2,
  },
  metaMagnetFlow: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 172,
    maxWidth: 220,
  },
  detailTileRegular: {
    flexBasis: 220,
    maxWidth: 360,
  },
  detailTileCompact: {
    flexBasis: '47%',
    maxWidth: 220,
  },
  statusMagnet: { backgroundColor: '#E8F0FF' },
  amountMagnet: { backgroundColor: '#F4F7FB' },
  metaLabel: { fontSize: FONT_SIZE.xs, color: BRAND_COLORS.textMuted, textTransform: 'uppercase' },
  metaValue: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  amountValue: { fontSize: FONT_SIZE.lg, color: BRAND_COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold },
  magnetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  fieldMagnet: {
    minWidth: 172,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: BRAND_COLORS.background,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  fieldMagnetLabel: {
    fontSize: FONT_SIZE.xs,
    color: BRAND_COLORS.textMuted,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHT.semibold,
  },
  fieldMagnetValue: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  footerHintWrap: { paddingTop: SPACING.sm, paddingBottom: SPACING.xl, alignItems: 'center' },
  footerHintText: { fontSize: FONT_SIZE.sm, color: BRAND_COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyStateText: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.textMuted },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  modalSheet: {
    backgroundColor: BRAND_COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '72%',
    ...SHADOWS.lg,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND_COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  modalTitle: { fontSize: FONT_SIZE.lg, color: BRAND_COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold },
  modalClose: { fontSize: FONT_SIZE.lg, color: BRAND_COLORS.textMuted },
  modalBody: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  modalHint: { fontSize: FONT_SIZE.sm, color: BRAND_COLORS.textMuted, marginBottom: SPACING.md },
  modalLabel: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.xs,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  modalSectionTitle: { fontSize: FONT_SIZE.md, color: BRAND_COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.sm },
  modalDivider: { height: 1, backgroundColor: BRAND_COLORS.border, marginVertical: SPACING.md },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BRAND_COLORS.divider,
  },
  modalListMain: { flex: 1 },
  modalListText: { fontSize: FONT_SIZE.sm, color: BRAND_COLORS.textPrimary },
  modalListTextActive: { color: BRAND_COLORS.accent, fontWeight: FONT_WEIGHT.semibold },
  modalChoiceItem: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  modalChoiceItemActive: {
    borderColor: BRAND_COLORS.primary,
    backgroundColor: '#EEF4FF',
  },
  modalChoiceText: {
    fontSize: FONT_SIZE.sm,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },
  modalChoiceTextActive: {
    color: BRAND_COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  sortChoiceGroup: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sortChoiceTitle: {
    fontSize: FONT_SIZE.md,
    color: BRAND_COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  sortChoiceActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  groupingPickerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  linkText: { fontSize: FONT_SIZE.xs, color: BRAND_COLORS.accent, marginLeft: SPACING.md, fontWeight: FONT_WEIGHT.medium },
  linkDanger: { color: BRAND_COLORS.error },
  primaryButton: {
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  switchLabel: { fontSize: FONT_SIZE.sm, color: BRAND_COLORS.textPrimary },
  operatorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  operatorChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: BRAND_COLORS.background,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  operatorChipActive: { backgroundColor: BRAND_COLORS.primary, borderColor: BRAND_COLORS.primary },
  operatorChipText: { fontSize: FONT_SIZE.xs, color: BRAND_COLORS.textSecondary },
  operatorChipTextActive: { color: '#FFFFFF' },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  optionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: BRAND_COLORS.background,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  optionChipActive: { backgroundColor: BRAND_COLORS.accent, borderColor: BRAND_COLORS.accent },
  optionChipText: { fontSize: FONT_SIZE.xs, color: BRAND_COLORS.textSecondary },
  optionChipTextActive: { color: '#FFFFFF' },
});
