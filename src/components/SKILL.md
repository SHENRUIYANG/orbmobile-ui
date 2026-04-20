# Components Skill Notes

Use `components/` for all UI code shipped by the library.

## Layering rules

1. `Atoms/`: generic primitives only
2. `Molecules/`: reusable composites built from atoms
3. Scene folders: integrated workflows and wrappers

## Rules

- If the UI can be reused across multiple scenes, keep it in `Atoms/` or `Molecules/`
- If the UI expresses a full workflow, keep it in the matching scene folder
- Keep `StdReport/` as the main native report surface
- Keep `AgentUI/` as a thin wrapper over `WebViewBridge/`
- Keep `Kanban/` as a native mobile board surface
- Keep `Pad/` limited to native touch-first utilities that still belong in this package

## Verification

- Root: `npm run typecheck`
- Manual: exercise the matching screen in `examples-native/`
