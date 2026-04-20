# Pad Skill Notes

Use `Pad/` for native touch-first utilities, not for web feature parity.

## Put code here when

- The component is useful on native tablets or touch-first mobile workflows
- The behavior is not better served by a web-backed `orbcafe-ui` surface

## Rules

- Keep this folder narrow
- Avoid reviving demo-only pad composites
- Keep reusable touch helpers exported from `Pad/index.ts`
- If a camera or scanner component is added here later, prefer atomic or molecular structure over full demo screens
