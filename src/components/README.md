# Components

This folder follows a layered structure:

- `Atoms/`: lowest-level building blocks
- `Molecules/`: reusable composites such as table/filter surfaces that are reused by higher-level scenes
- scenario folders such as `StdReport/`, `Pad/`, `Kanban/`, and `AgentUI/`: integrated components for a specific product surface

## Rule of thumb

- If a piece is generic and can be reused anywhere, it belongs in `Atoms/` or `Molecules/`
- If a piece expresses a full business scene, keep it in the matching scenario folder
- `examples-native/` should showcase usage, not own reusable UI implementations

## Current primary composition

- `StdReport/` is the main native report composition
- screens should prefer `MStandardPage` and only drop to `useStandardReport` when the shell must be customized
