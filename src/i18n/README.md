# i18n

`i18n/` contains the localization provider and message catalog for the library.

## Public API

- `OrbmobileI18nProvider`
- `useOrbmobileI18n`
- locale and message types from `messages.ts`

## Intent

- Provide a package-level translation context for components that need localized labels
- Keep the default message catalog centralized and overridable by consumers

## Notes

- Default locale: `en`
- Consumers can pass locale-specific overrides into `OrbmobileI18nProvider`
- Message interpolation uses `{token}` placeholders
