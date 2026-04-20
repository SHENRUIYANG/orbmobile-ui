# Source Skill Notes

Use `src/` as the canonical implementation of the library.

## Rules

- Export reusable public APIs from `src/index.ts`
- Prefer the smallest correct change inside the right layer
- Do not move reusable UI into `examples-native/`
- Keep web-backed experiences behind `WebViewBridge/` wrappers
- Keep native-first report composition in `StdReport/`

## Folder intent

1. `Atoms/`: primitive controls and visual shells
2. `Molecules/`: reusable composed components
3. Scene folders: integrated product surfaces
4. `config/`, `i18n/`, `lib/`: shared non-visual support

## Verification

- Root: `npm run typecheck`
- Example app: `cd examples-native && npx expo start`
