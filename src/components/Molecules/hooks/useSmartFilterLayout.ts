import type { DimensionValue } from 'react-native';

export interface UseSmartFilterLayoutResult {
  filterColumnCount: number;
  filterCardWidth: DimensionValue;
}

export function useSmartFilterLayout(width: number): UseSmartFilterLayoutResult {
  const filterColumnCount = width >= 1040 ? 4 : width >= 760 ? 3 : width >= 460 ? 2 : 1;
  const filterCardWidth =
    filterColumnCount === 1 ? '100%' : filterColumnCount === 2 ? '48%' : filterColumnCount === 3 ? '31.5%' : '23.5%';

  return { filterColumnCount, filterCardWidth };
}
