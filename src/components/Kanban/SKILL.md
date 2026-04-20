# Kanban Skill Notes

Use this folder for the native Kanban board implementation.

## When to add code here

- A screen needs the shared native bucket board rather than a one-off local list
- A Kanban behavior should be reusable across apps that consume `orbmobile-ui`
- A change affects bucket rendering, card rendering, responsive layout, or cross-bucket movement

## Rules

- Keep `MKanbanBoard` native and touch-friendly
- Prefer a simple bucket/card data model over scene-specific backend assumptions
- Reuse atoms and molecules for card content before adding Kanban-specific primitives
- Keep example data in `examples-native/`, not inside the library component
- Preserve a clear bucket-selection interaction so users can move cards to any live stage on mobile and pad
- Keep the board horizontally scrollable while each bucket can scroll vertically on its own
- Preserve phone and pad spacing rules; fix layout issues in the board before pushing workaround spacing into example screens
- Export shared Kanban contracts from `index.ts` when they are part of the supported public API

## Current behavior to preserve

- `MKanbanBoard` renders a native board from local `buckets` data
- Bucket cards may show description, status badge, tags, and fact tiles
- Moving a card uses the built-in bucket selector modal, not hard-coded left/right actions
- Buckets may define `cardStatus` and `cardStatusLabel`, and moved cards inherit those values
- Header spacing should coexist with the floating navigation affordance used in `examples-native/App.tsx`

## Preferred layering

1. Atoms and molecules for generic UI pieces
2. `Kanban/` for the integrated board composition and its shared contracts
3. `examples-native/` only for demo data, navigation, and manual verification

## Verification

- Root: `npm run typecheck`
- Manual: open the Kanban screen in `examples-native/` on both phone and pad layouts
- Confirm horizontal lane scroll, per-bucket vertical scroll, and card move modal behavior
