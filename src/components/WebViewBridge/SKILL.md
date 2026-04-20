# WebViewBridge Skill Notes

Use this folder for shared WebView embedding and bridge behavior.

## Rules

- Keep route wrappers outside this folder
- Put shared URL, loading, and message-parsing behavior here
- Avoid scene-specific UI logic in `OrbWebView`
- Preserve the default localhost development workflow unless there is a concrete reason to change it

## Verification

- Root: `npm run typecheck`
- Manual: confirm each wrapper screen loads against the configured base URL
