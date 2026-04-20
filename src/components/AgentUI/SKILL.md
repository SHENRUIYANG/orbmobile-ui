# AgentUI Skill Notes

Use this folder for the native wrapper around the web agent/chat surface.

## Rules

- Keep `MAgentUI` thin
- Route shared embed behavior through `WebViewBridge/`
- Do not add independent chat UI here unless native-first product requirements change

## Verification

- Ensure the paired `orbcafe-ui` server is running
- Open the agent UI screen in `examples-native/`
