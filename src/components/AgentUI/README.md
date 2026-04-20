# AgentUI

`AgentUI/` exposes the native wrapper for the web chat and agent experience.

## Public API

- `MAgentUI`

## Intent

- Reuse the `orbcafe-ui` agent/chat surface inside a React Native WebView
- Keep the native wrapper focused on bridge integration rather than re-implementing chat UI

## Notes

- Default path: `/chat`
- Requires the paired web server unless `setOrbmobileBaseUrl()` is set to another host
