# Config

`config/` contains shared configuration and design tokens.

## Public API

- `foundations.ts`: color, spacing, radius, type, and shadow tokens

## Intent

- Keep visual foundations centralized
- Reuse the same token source across atoms, molecules, and scenes

## Notes

- Export shared tokens through `config/index.ts`
- Prefer consuming these tokens before adding ad hoc values in components
