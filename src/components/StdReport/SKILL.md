# StdReport Skill Notes

Use this folder for the native Standard Report composition.

## When to add code here

- A report screen should work by passing columns, filters, and data into `MStandardPage`
- A report needs the same persistence semantics for variants/layouts
- A custom report shell still needs shared logic from `useStandardReport`

## Preferred layering

1. Atoms: generic building blocks only
2. Scenario folder (`StdReport`): integrated report behavior and UI
3. Example app: demo data, route wiring, and showcase usage

## Rules

- Do not re-implement report state inside `examples-native/`
- Add reusable state transitions to `Hooks/useStandardReport.ts`
- Add reusable contracts to `types.ts`
- Keep `MStandardPage` as the default integrated entrypoint
- Keep persistence behavior aligned with AsyncStorage keys used in `variantStorage.ts`

## Verification

- Root: `npm run typecheck`
- Example app: `cd examples-native && npx tsc --noEmit`
- Manual: open the `StdReport` screen in Expo and verify filter, sort, group, layout, and variant flows
