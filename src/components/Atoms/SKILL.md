# Atoms Skill Notes

Use `Atoms/` for primitive components that can be dropped into many screens.

## Put code here when

- The component is generic and scene-agnostic
- The component mostly owns visuals, touch behavior, and small local state
- The same API would make sense in multiple products or screens

## Do not put here

- Report-specific orchestration
- WebView route wrappers
- Storage-backed scene logic

## Rules

- Keep APIs small and composable
- Prefer style props over scene-specific feature flags
- Export new atoms through `Atoms/index.ts`
- Verify from the real composed consumer before expanding the API
