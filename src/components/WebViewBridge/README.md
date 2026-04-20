# WebViewBridge

`WebViewBridge/` is the shared embedding layer for web-backed component surfaces.

## Public API

- `OrbWebView`
- `setOrbmobileBaseUrl`
- `getOrbmobileBaseUrl`
- WebView message types from `types.ts`

## Intent

- Centralize the shared React Native WebView behavior
- Keep route-specific wrappers in `Kanban/` and `AgentUI/`
- Make the paired `orbcafe-ui` host configurable at app startup

## Notes

- Default base URL: `http://localhost:3000`
- `OrbWebView` appends a `path` such as `/chat`
- Non-JSON `postMessage` payloads are ignored by the bridge handler
