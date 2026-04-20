# Atoms

`Atoms/` contains the smallest reusable React Native building blocks in the library.

## Public API

- `MButton`
- `MCameraView`
- `MChip`
- `MDivider`
- `MIconButton`
- `MSurface`
- `MTextField`
- `MTypography`

## Intent

- Keep atoms generic and portable
- Avoid embedding scene-specific state or business rules here
- Let molecules and scene folders compose these primitives

## Notes

- `MCameraView` is a native camera viewport shell, not a camera SDK binding
- Atoms should be exported from `Atoms/index.ts` and then from `src/index.ts`
