# i18n Skill Notes

Use this folder for package-level localization support.

## Rules

- Add shared message keys to `messages.ts`
- Keep provider behavior in `context.tsx`
- Preserve English defaults for every key
- Keep interpolation token names stable when translating existing messages

## Verification

- Root: `npm run typecheck`
- Manual: render a consumer under `OrbmobileI18nProvider` and confirm labels resolve for the target locale
