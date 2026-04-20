# Changelog

All notable changes to `orbmobile-ui` are documented in this file.

## [0.1.0] - 2026-04-19

### 🎉 Initial Release — React Native UI Library

**orbmobile-ui** is the React Native sibling of orbcafe-ui (web).
This release establishes the library architecture, core components,
and the WebView bridge pattern for complex UIs.

### Added

- **Project restructuring**: Renamed from orbcafe-ui fork to standalone
  `orbmobile-ui` React Native library.
- **Atoms**: `MButton`, `MTextField`, `MChip`, `MTypography`, `MIconButton`,
  `MDivider`, `MSurface` — pure React Native building blocks.
- **Molecules**: `MMessageBox` (modal dialog), `MStatusBadge` (status indicator).
- **Pad components** (native touch-optimised):
  - `MNumericKeypad` — touch-friendly numeric keypad
  - `usePadLayout` — orientation detection hook
- **WebView bridge**:
  - `OrbWebView` — generic WebView wrapper for orbcafe-ui pages
  - `setOrbmobileBaseUrl()` / `getOrbmobileBaseUrl()` — runtime URL configuration
  - `MAgentUI` — Agent Chat UI (WebView bridge to `/chat`)
- **Native business surfaces**:
  - `MKanbanBoard` — native Kanban board for touch-first mobile layouts
- **i18n**: Full 6-locale support (`en`, `zh`, `fr`, `de`, `ja`, `ko`) with
  `OrbmobileI18nProvider` and `useOrbmobileI18n()` hook.
- **Design tokens**: `BRAND_COLORS`, `SPACING`, `RADIUS`, `FONT_SIZE`,
  `FONT_WEIGHT`, `SHADOWS` — React Native compatible values.
- **Example app** (`examples-native/`): Expo app with navigation to all
  component demos.

### Removed

- All web-only dependencies: `@mui/*`, `@emotion/*`, `tailwind-merge`,
  `framer-motion`, `@dnd-kit/*`, `mermaid`, `react-markdown`,
  `react-syntax-highlighter`, `@radix-ui/*`, `lucide-react`, `ogl`,
  `rehype-*`, `remark-*`, `next`, `next-themes`.
- All web-only source code (React DOM components, CSS modules, Tailwind classes).
- `tsup.config.ts` (not needed for React Native library).
- `examples/` web Next.js example app.
- `scripts/` web build and check scripts.
- `skills/` orbcafe-ui-specific AI skill documents.
- Empty `DoushBao-UI-Native/` placeholder directory.

### Changed

- Package name: `orbcafe-ui` → `orbmobile-ui`.
- All `Orbcafe*` type names → `Orbmobile*` (e.g. `OrbcafeLocale` → `OrbmobileLocale`).
- `tsconfig.json`: targets React Native (`jsx: "react-native"`, no DOM lib).
- `.gitignore`: updated for React Native / Expo project.
- `examples-native`: imports updated from `doushabao-ui-native` → `orbmobile-ui`.
