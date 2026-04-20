# Molecules

`Molecules/` contains reusable composites built from atoms and light hooks.

## Public API

- `MCameraPreviewPanel`
- `MMessageBox`
- `MNavigationIsland`
- `MSmartFilterPanel`
- `MStatusBadge`
- `MTableSurface`
- `useSmartFilterLayout`

## Intent

- Keep reusable composition here
- Let `StdReport/` and other scene folders consume these components instead of re-implementing them
- Keep them generic enough to be reused outside a single screen

## Notes

- `MSmartFilterPanel` and `MTableSurface` are report-oriented molecules, but they still belong here because they are reusable composition units rather than full pages
- `MCameraPreviewPanel` is the composed camera shell for native workflows without binding the package to one camera SDK
