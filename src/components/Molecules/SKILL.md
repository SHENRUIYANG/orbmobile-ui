# Molecules Skill Notes

Use `Molecules/` for reusable composites that sit above atoms and below full scenes.

## Put code here when

- A component coordinates multiple atoms
- The behavior is reusable across more than one screen
- A small supporting hook belongs tightly to the component family

## Rules

- Do not move full page orchestration into this folder
- Prefer props that expose composition points instead of scene-specific assumptions
- Keep layout hooks near the molecule when they are not broadly reusable elsewhere
- Export new molecules through `Molecules/index.ts`

## Verification

- Root: `npm run typecheck`
- Manual: validate through `StdReport` or the consuming example screen
