# Molecule Hooks

This folder holds hooks that support reusable molecule layout and behavior.

## Current API

- `useSmartFilterLayout`: returns responsive filter column count and card width hints for smart-filter style layouts

## Intent

- Keep hooks here only when they are tightly coupled to molecule behavior
- If a hook becomes scene-level, move it to the matching scene folder instead
