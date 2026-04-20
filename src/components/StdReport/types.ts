/**
 * StdReport types — mirrors orbcafe-ui CSmartFilter / CVariantManager / CLayoutManager types.
 */

/* ── Filter Types ──────────────────────────────────────────────────── */

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multi-select';

export type TextOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains';
export type NumberOperator = 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'between' | 'notEquals';
export type SelectOperator = 'equals' | 'notEquals';
export type DateOperator = 'equals' | 'before' | 'after' | 'between' | 'today' | 'thisWeek' | 'thisMonth';
export type FilterOperator = TextOperator | NumberOperator | SelectOperator | DateOperator;

export interface FilterValue {
  value: string | string[];
  operator?: FilterOperator;
  /** For 'between' operator */
  valueTo?: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  hidden?: boolean;
  options?: { label: string; value: string }[];
}

export type FilterValues = Record<string, FilterValue>;

/* ── Variant Types ─────────────────────────────────────────────────── */

export interface VariantMetadata {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  filters?: FilterValues;
  layout?: LayoutData;
  layoutId?: string;
  scope?: 'Search' | 'Layout' | 'Both';
}

/* ── Layout Types ──────────────────────────────────────────────────── */

export interface LayoutColumnConfig {
  key: string;
  visible: boolean;
  width?: number;
  order: number;
}

export interface LayoutData {
  columns: LayoutColumnConfig[];
  groupByKey?: string | null;
}

export interface LayoutMetadata {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  layoutData: LayoutData;
}

/* ── Column / Report Types ─────────────────────────────────────────── */

export interface ColumnDef {
  key: string;
  label: string;
  flex?: number;
  sortable?: boolean;
  groupable?: boolean;
  /** Initial visibility (default true) */
  visible?: boolean;
}

export type StandardReportRowData = Record<string, string | number | boolean | null | undefined>;

export interface MStandardPageProps {
  testID?: string;
  appId?: string;
  tableKey?: string;
  title?: string;
  columns?: ColumnDef[];
  filters?: FilterField[];
  data?: StandardReportRowData[];
  pageSize?: number;
  onRowPress?: (row: StandardReportRowData) => void;
  onFilterChange?: (filters: FilterValues) => void;
}

export interface ReportMetadata {
  id: string;
  title: string;
  columns: ColumnDef[];
  filters: FilterField[];
  variants?: VariantMetadata[];
}
