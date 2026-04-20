# AGENTS.md

## Scope
- Repo is not a monorepo. Root package `orbmobile-ui` is the library; `examples-native/` is a separate Expo demo app that consumes the library via `file:..`.
- Library public entrypoint is `src/index.ts`. There is no build output or `dist/`; package metadata points `main` and `types` directly at `src/index.ts`.

## Verify Changes
- Root verification: `npm run typecheck`
- Do not rely on `npm run lint` for validation; it is a placeholder that only prints `no linter configured yet`.
- There is no repo test suite or CI workflow in this repo as checked in.

## Example App
- Demo app commands run from `examples-native/`: `npm install`, then `npx expo start` (or `npm run ios` / `npm run android` / `npm run web`).
- `examples-native/metro.config.js` aliases `orbmobile-ui` to the root `src/` folder and watches the repo root. Edit library files in `src/` and use the Expo app for manual verification; no separate build step is needed for the demo.
- Metro is configured to force the example app's own `react`, `react-native`, `react-native-paper`, and `react-native-webview` copies to avoid duplicate React trees. Preserve that setup if touching Metro config.

## Architecture Notes
- `src/components/WebViewBridge/` is the shared bridge layer for web-backed surfaces. `MAgentUI` is currently a thin wrapper around `OrbWebView` with a fixed path.
- `MKanbanBoard` is now a native React Native board, not a WebView wrapper.
- WebView-backed components default to `http://localhost:3000` unless `setOrbmobileBaseUrl()` is called. If a WebView screen looks broken in the demo, verify the paired `orbcafe-ui` server is running or set an explicit base URL.
- `MStandardPage` is native React Native, not a WebView wrapper. Its saved variants/layouts persist through `@react-native-async-storage/async-storage` in `src/components/StdReport/variantStorage.ts` using keys `orbcafe.variants.{appId}.{tableKey}` and `orbcafe.layouts.{appId}.{tableKey}`.
- Pad hooks/components live under `src/components/Pad/`; `usePadLayout` is the shared layout/orientation hook used by pad-style screens and `MStandardPage`.

## TypeScript / Imports
- Root TypeScript only includes `src/` and excludes `examples-native/`. Run library typechecks from the repo root; demo app typing is separate.
- Root tsconfig defines `@/*` as `./src/*`. Follow that alias only inside the library.
