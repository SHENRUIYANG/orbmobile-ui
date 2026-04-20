import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ColumnDef,
  FilterField,
  FilterOperator,
  FilterValue,
  FilterValues,
  LayoutColumnConfig,
  LayoutData,
  LayoutMetadata,
  MStandardPageProps,
  StandardReportRowData,
  VariantMetadata,
} from '../types';
import {
  deleteLayout,
  deleteVariant,
  loadLayouts,
  loadVariants,
  saveLayout,
  saveVariant,
  setDefaultLayout,
  setDefaultVariant,
} from '../variantStorage';

export interface StandardReportGroupSection {
  key: string;
  label: string;
  rowCount: number;
  rows: StandardReportRowData[];
}

export type StandardReportListEntry =
  | { type: 'group'; key: string; section: StandardReportGroupSection }
  | { type: 'row'; key: string; row: StandardReportRowData };

export interface UseStandardReportOptions extends Pick<MStandardPageProps, 'appId' | 'tableKey' | 'columns' | 'filters' | 'data' | 'pageSize' | 'onFilterChange'> {}

const PAGE_SIZE_DEFAULT = 8;

export const getDefaultOperator = (field: FilterField): FilterOperator => {
  if (field.type === 'number') return 'equals';
  if (field.type === 'select' || field.type === 'multi-select') return 'equals';
  return 'contains';
};

const normalizeString = (value: unknown) => String(value ?? '').trim().toLowerCase();

export const toLayoutColumns = (columns: ColumnDef[], current?: LayoutColumnConfig[]): LayoutColumnConfig[] => {
  return columns.map((column, index) => {
    const existing = current?.find((item) => item.key === column.key);
    return existing ?? { key: column.key, visible: column.visible !== false, order: index };
  });
};

export const formatValue = (columnKey: string, value: StandardReportRowData[string]) => {
  if (value == null) return '—';
  if (typeof value === 'number' && /amount|total|price|cost/i.test(columnKey)) {
    return `$${value.toLocaleString()}`;
  }
  return String(value);
};

export const matchesFilter = (row: StandardReportRowData, field: FilterField, filterValue: FilterValue): boolean => {
  const rawValue = row[field.id];
  const operator = filterValue.operator ?? getDefaultOperator(field);

  if (field.type === 'number') {
    const current = Number(rawValue);
    const from = Number(filterValue.value);
    const to = Number(filterValue.valueTo);
    if (Number.isNaN(from)) return true;
    switch (operator) {
      case 'equals':
        return current === from;
      case 'greaterThan':
        return current > from;
      case 'lessThan':
        return current < from;
      case 'greaterThanOrEqual':
        return current >= from;
      case 'lessThanOrEqual':
        return current <= from;
      case 'between':
        return Number.isNaN(to) ? current >= from : current >= from && current <= to;
      case 'notEquals':
        return current !== from;
      default:
        return true;
    }
  }

  const current = normalizeString(rawValue);

  if (field.type === 'multi-select') {
    const selected = Array.isArray(filterValue.value)
      ? filterValue.value.map((item) => normalizeString(item))
      : [];
    if (selected.length === 0) return true;
    return operator === 'notEquals' ? !selected.includes(current) : selected.includes(current);
  }

  const value = normalizeString(filterValue.value);
  if (!value) return true;

  switch (operator) {
    case 'contains':
      return current.includes(value);
    case 'equals':
      return current === value;
    case 'startsWith':
      return current.startsWith(value);
    case 'endsWith':
      return current.endsWith(value);
    case 'notContains':
      return !current.includes(value);
    case 'notEquals':
      return current !== value;
    default:
      return true;
  }
};

export function useStandardReport({
  appId = 'orbmobile-ui',
  tableKey = 'standard-report',
  columns = [],
  filters = [],
  data = [],
  pageSize = PAGE_SIZE_DEFAULT,
  onFilterChange,
}: UseStandardReportOptions) {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [loadedPages, setLoadedPages] = useState(1);
  const [layoutColumns, setLayoutColumns] = useState<LayoutColumnConfig[]>(() => toLayoutColumns(columns));
  const [variants, setVariants] = useState<VariantMetadata[]>([]);
  const [layouts, setLayouts] = useState<LayoutMetadata[]>([]);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null);
  const [groupByKey, setGroupByKey] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<string[]>([]);

  const updateFilters = useCallback(
    (next: FilterValues) => {
      setFilterValues(next);
      setLoadedPages(1);
      onFilterChange?.(next);
    },
    [onFilterChange],
  );

  const applyLayoutData = useCallback(
    (layoutData: LayoutData) => {
      setLayoutColumns(toLayoutColumns(columns, layoutData.columns));
      setGroupByKey(layoutData.groupByKey ?? null);
      setCollapsedGroupKeys([]);
    },
    [columns],
  );

  useEffect(() => {
    setLayoutColumns((current) => toLayoutColumns(columns, current));
  }, [columns]);

  useEffect(() => {
    if (groupByKey && !columns.some((column) => column.key === groupByKey)) {
      setGroupByKey(null);
    }
  }, [columns, groupByKey]);

  useEffect(() => {
    let cancelled = false;

    const loadPersistedState = async () => {
      const [storedVariants, storedLayouts] = await Promise.all([loadVariants(appId, tableKey), loadLayouts(appId, tableKey)]);
      if (cancelled) return;

      setVariants(storedVariants);
      setLayouts(storedLayouts);

      const defaultVariant = storedVariants.find((item) => item.isDefault);
      if (defaultVariant) {
        setActiveVariantId(defaultVariant.id);
        if (defaultVariant.filters) {
          updateFilters(defaultVariant.filters);
        }
        if (defaultVariant.layout) {
          applyLayoutData(defaultVariant.layout);
        }
      }

      const defaultLayout = storedLayouts.find((item) => item.isDefault);
      if (defaultLayout) {
        setActiveLayoutId(defaultLayout.id);
        applyLayoutData(defaultLayout.layoutData);
      }
    };

    void loadPersistedState();

    return () => {
      cancelled = true;
    };
  }, [appId, tableKey, applyLayoutData, updateFilters]);

  const visibleColumns = useMemo(() => {
    return [...layoutColumns]
      .sort((left, right) => left.order - right.order)
      .filter((item) => item.visible)
      .map((item) => columns.find((column) => column.key === item.key))
      .filter((item): item is ColumnDef => Boolean(item));
  }, [columns, layoutColumns]);

  const sortableColumns = useMemo(() => visibleColumns.filter((column) => column.sortable !== false), [visibleColumns]);
  const groupableColumns = useMemo(() => columns.filter((column) => column.groupable !== false), [columns]);

  const filteredRows = useMemo(() => {
    const next = data.filter((row) => {
      return filters.every((field) => {
        const value = filterValues[field.id];
        if (!value) return true;
        if (Array.isArray(value.value) && value.value.length === 0) return true;
        if (!Array.isArray(value.value) && String(value.value ?? '').trim() === '') return true;
        return matchesFilter(row, field, value);
      });
    });

    if (!sortKey) return next;

    return [...next].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      const comparison = String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, { numeric: true });
      return sortAsc ? comparison : -comparison;
    });
  }, [data, filterValues, filters, sortAsc, sortKey]);

  const visibleRows = useMemo(() => filteredRows.slice(0, loadedPages * pageSize), [filteredRows, loadedPages, pageSize]);
  const hasMorePages = visibleRows.length < filteredRows.length;

  useEffect(() => {
    setLoadedPages(1);
  }, [filteredRows.length, sortAsc, sortKey]);

  const activeVariant = variants.find((item) => item.id === activeVariantId);
  const activeLayout = layouts.find((item) => item.id === activeLayoutId);
  const activeGroupColumn = groupableColumns.find((column) => column.key === groupByKey) ?? null;

  const activeFilterCount = useMemo(() => {
    return Object.values(filterValues).filter((value) => {
      if (Array.isArray(value.value)) return value.value.length > 0;
      return String(value.value ?? '').trim().length > 0;
    }).length;
  }, [filterValues]);

  const activeFilterSummary = useMemo(() => {
    const entries = filters
      .map((field) => {
        const value = filterValues[field.id];
        if (!value) return null;
        if (Array.isArray(value.value)) {
          return value.value.length > 0 ? `${field.label}: ${value.value.join(', ')}` : null;
        }
        const text = String(value.value ?? '').trim();
        return text ? `${field.label}: ${text}` : null;
      })
      .filter((item): item is string => Boolean(item));

    if (entries.length === 0) return '未设置搜索条件';
    if (entries.length <= 2) return entries.join('  ·  ');
    return `${entries.slice(0, 2).join('  ·  ')}  ·  +${entries.length - 2}`;
  }, [filterValues, filters]);

  const clearFilters = useCallback(() => {
    updateFilters({});
  }, [updateFilters]);

  const clearSort = useCallback(() => {
    setSortKey(null);
    setSortAsc(true);
    setLoadedPages(1);
  }, []);

  const handleGroupByChange = useCallback((nextGroupByKey: string | null) => {
    setGroupByKey(nextGroupByKey);
    setCollapsedGroupKeys([]);
    setLoadedPages(1);
  }, []);

  const toggleGroupCollapsed = useCallback((sectionKey: string) => {
    setCollapsedGroupKeys((current) => (current.includes(sectionKey) ? current.filter((item) => item !== sectionKey) : [...current, sectionKey]));
  }, []);

  const refreshVariants = useCallback(async () => {
    const stored = await loadVariants(appId, tableKey);
    setVariants(stored);
    return stored;
  }, [appId, tableKey]);

  const refreshLayouts = useCallback(async () => {
    const stored = await loadLayouts(appId, tableKey);
    setLayouts(stored);
    return stored;
  }, [appId, tableKey]);

  const handleSaveVariant = useCallback(
    async (name: string, isDefault: boolean) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const saved = await saveVariant(appId, tableKey, {
        name: trimmed,
        isDefault,
        filters: filterValues,
        layout: { columns: layoutColumns, groupByKey },
      });
      await refreshVariants();
      setActiveVariantId(saved.id);
      return saved;
    },
    [appId, filterValues, groupByKey, layoutColumns, refreshVariants, tableKey],
  );

  const handleApplyVariant = useCallback(
    (variant: VariantMetadata) => {
      setActiveVariantId(variant.id);
      if (variant.filters) {
        updateFilters(variant.filters);
      }
      if (variant.layout) {
        applyLayoutData(variant.layout);
      }
    },
    [applyLayoutData, updateFilters],
  );

  const handleDeleteVariant = useCallback(
    async (variantId: string) => {
      await deleteVariant(appId, tableKey, variantId);
      await refreshVariants();
      if (activeVariantId === variantId) {
        setActiveVariantId(null);
      }
    },
    [activeVariantId, appId, refreshVariants, tableKey],
  );

  const handleSetDefaultVariant = useCallback(
    async (variantId: string) => {
      await setDefaultVariant(appId, tableKey, variantId);
      await refreshVariants();
    },
    [appId, refreshVariants, tableKey],
  );

  const handleSaveLayout = useCallback(
    async (name: string, isDefault: boolean) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const saved = await saveLayout(appId, tableKey, {
        name: trimmed,
        isDefault,
        layoutData: { columns: layoutColumns, groupByKey },
      });
      await refreshLayouts();
      setActiveLayoutId(saved.id);
      return saved;
    },
    [appId, groupByKey, layoutColumns, refreshLayouts, tableKey],
  );

  const handleApplyLayout = useCallback(
    (layout: LayoutMetadata) => {
      setActiveLayoutId(layout.id);
      applyLayoutData(layout.layoutData);
    },
    [applyLayoutData],
  );

  const handleDeleteLayout = useCallback(
    async (layoutId: string) => {
      await deleteLayout(appId, tableKey, layoutId);
      await refreshLayouts();
      if (activeLayoutId === layoutId) {
        setActiveLayoutId(null);
      }
    },
    [activeLayoutId, appId, refreshLayouts, tableKey],
  );

  const handleSetDefaultLayout = useCallback(
    async (layoutId: string) => {
      await setDefaultLayout(appId, tableKey, layoutId);
      await refreshLayouts();
    },
    [appId, refreshLayouts, tableKey],
  );

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setLayoutColumns((current) => current.map((item) => (item.key !== columnKey ? item : { ...item, visible: !item.visible })));
  }, []);

  const groupSections = useMemo(() => {
    if (!groupByKey) return [];

    const grouped = new Map<string, StandardReportGroupSection>();

    visibleRows.forEach((row) => {
      const formatted = formatValue(groupByKey, row[groupByKey]);
      const sectionKey = `${groupByKey}:${formatted}`;
      const existing = grouped.get(sectionKey);

      if (existing) {
        existing.rows.push(row);
        existing.rowCount += 1;
        return;
      }

      grouped.set(sectionKey, {
        key: sectionKey,
        label: formatted,
        rowCount: 1,
        rows: [row],
      });
    });

    return Array.from(grouped.values());
  }, [groupByKey, visibleRows]);

  const allGroupsCollapsed = groupSections.length > 0 && groupSections.every((section) => collapsedGroupKeys.includes(section.key));

  const listEntries = useMemo<StandardReportListEntry[]>(() => {
    if (!groupByKey) {
      return visibleRows.map((row, index) => ({
        type: 'row',
        key: `row-${String(row[visibleColumns[0]?.key] ?? index)}-${index}`,
        row,
      }));
    }

    return groupSections.flatMap((section, sectionIndex) => {
      const header: StandardReportListEntry = {
        type: 'group',
        key: `group-${section.key}-${sectionIndex}`,
        section,
      };

      if (collapsedGroupKeys.includes(section.key)) {
        return [header];
      }

      const rows: StandardReportListEntry[] = section.rows.map((row, rowIndex) => ({
        type: 'row',
        key: `row-${section.key}-${String(row[visibleColumns[0]?.key] ?? rowIndex)}-${rowIndex}`,
        row,
      }));

      return [header, ...rows];
    });
  }, [collapsedGroupKeys, groupByKey, groupSections, visibleColumns, visibleRows]);

  return {
    filterValues,
    updateFilters,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    loadedPages,
    setLoadedPages,
    layoutColumns,
    setLayoutColumns,
    variants,
    layouts,
    activeVariantId,
    activeLayoutId,
    activeVariant,
    activeLayout,
    groupByKey,
    setGroupByKey,
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
  };
}
