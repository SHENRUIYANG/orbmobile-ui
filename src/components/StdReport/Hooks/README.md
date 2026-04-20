# StdReport Hooks

This folder contains the reusable state and data-shaping logic behind `MStandardPage`.

## Public API

- `useStandardReport`
- `formatValue`
- `getDefaultOperator`
- `matchesFilter`
- `toLayoutColumns`

## Intent

- Keep report state transitions and derived data out of example screens
- Share filtering, sorting, grouping, and persistence-aware logic across custom report shells

## Notes

- `useStandardReport` owns variant and layout loading through `variantStorage.ts`
- The hook returns filtered rows, list entries, visible columns, group state, and persistence handlers
