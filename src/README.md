# Source

`src/` is the library source for `orbmobile-ui`, whose project codename is `DOUSHABAO` (`豆沙包`).

## Structure

- `components/`: UI building blocks and scene-level components
- `config/`: design tokens and shared configuration
- `i18n/`: message catalog and localization context
- `lib/`: small library utilities
- `index.ts`: public package entrypoint

## Layering

- Keep generic building blocks in `components/Atoms/`
- Keep reusable composites in `components/Molecules/`
- Keep scene-level integrations in folders such as `StdReport/`, `Kanban/`, `AgentUI/`, and `Pad/`
- Keep `examples-native/` as a consumer of this package, not an owner of reusable UI

## Verification

- Root: `npm run typecheck`
- Manual: `cd examples-native && npx expo start`
