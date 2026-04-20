# StdReport Hooks Skill Notes

Use this folder for reusable report logic that powers `MStandardPage` and custom report shells.

## Rules

- Keep data shaping and state transitions here
- Keep persisted variant and layout semantics aligned with `variantStorage.ts`
- Do not duplicate report orchestration inside `examples-native/`
- Export new helpers through `StdReport/Hooks/index.ts`

## Verification

- Root: `npm run typecheck`
- Manual: verify filter, sort, group, layout, and variant flows on the `StdReport` screen
