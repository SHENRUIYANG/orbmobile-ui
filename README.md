# orbmobile-ui

React Native UI component library — the mobile sibling of [orbcafe-ui](https://github.com/SHENRUIYANG/orbcafe-ui) (web).

Both libraries share the same visual identity and component vocabulary, but **orbmobile-ui** targets React Native / Expo apps while **orbcafe-ui** targets React / Next.js web apps.

---

## Architecture

```
orbmobile-ui/
├── src/                        # Library source
│   ├── index.ts                # Public entry point
│   ├── config/                 # Design tokens (colours, spacing, shadows)
│   ├── i18n/                   # Internationalisation (6 locales)
│   ├── lib/                    # Shared utilities
│   └── components/
│       ├── Atoms/              # Basic building blocks (Button, TextField, …)
│       ├── Molecules/          # Composite components (MessageBox, StatusBadge)
│       ├── WebViewBridge/      # Generic WebView wrapper for orbcafe-ui pages
│       ├── StdReport/          # Standard Report (WebView bridge)
│       ├── Kanban/             # Kanban Board (WebView bridge)
│       ├── PivotTable/         # Pivot Table (WebView bridge)
│       ├── AgentUI/            # Agent Chat UI (WebView bridge)
│       └── Pad/                # Native touch-optimized pad components
└── examples-native/            # Expo demo app
```

### Component Strategy

| Category | Rendering | Rationale |
|---|---|---|
| **Atoms & Molecules** | Pure React Native | Simple UI elements that are easy and performant to implement natively. |
| **Pad** | Pure React Native | Touch-optimized components that **must** be native for gesture performance. |
| **StdReport, Kanban, PivotTable, AgentUI** | WebView bridge | Complex components with heavy web dependencies (drag-and-drop, markdown, charts). The WebView loads the corresponding orbcafe-ui page from a web server. |

---

## Installation

```bash
npm install orbmobile-ui
# or
yarn add orbmobile-ui
```

### Peer Dependencies

| Package | Required? | Purpose |
|---|---|---|
| `react` ≥ 18 | ✅ Yes | Core |
| `react-native` ≥ 0.72 | ✅ Yes | Core |
| `react-native-webview` ≥ 13 | Optional | Required only if you use WebView-bridged components (StdReport, Kanban, PivotTable, AgentUI) |

---

## Quick Start

### 1. Native-only components (no WebView needed)

```tsx
import { MButton, MMessageBox, PNumericKeypad } from 'orbmobile-ui';

function MyScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <View>
      <MButton variant="contained" onPress={() => setDialogOpen(true)}>
        Delete Record
      </MButton>

      <MMessageBox
        open={dialogOpen}
        type="warning"
        title="Delete Item"
        message="Are you sure?"
        onConfirm={() => { /* delete */ setDialogOpen(false); }}
        onClose={() => setDialogOpen(false)}
      />

      <PNumericKeypad
        onSubmit={(value) => console.log('Entered:', value)}
      />
    </View>
  );
}
```

### 2. WebView-bridged components

First, configure the base URL of your orbcafe-ui web server:

```tsx
import { setOrbmobileBaseUrl } from 'orbmobile-ui';

// Call once at app startup (e.g. in App.tsx)
setOrbmobileBaseUrl('https://your-orbcafe-app.example.com');
```

Then use the component:

```tsx
import { CStandardPage, CKanbanBoard, AgentUI } from 'orbmobile-ui';

// Each renders a full-screen WebView loading the corresponding orbcafe-ui page
<CStandardPage />
<CKanbanBoard />
<AgentUI />
```

---

## Components

### Atoms

| Component | Description |
|---|---|
| `MButton` | Pressable button with `contained`, `outlined`, `text` variants and loading state |
| `MTextField` | Text input with label, helper text, and error state |
| `MChip` | Compact chip with optional close action |
| `MTypography` | Text component with semantic variants (`display`, `headline`, `title`, `body`, `caption`) |
| `MIconButton` | Circular icon button in three sizes |
| `MDivider` | Horizontal or vertical divider line |
| `MSurface` | Elevated card surface with shadow presets |

### Molecules

| Component | Description |
|---|---|
| `MMessageBox` | Modal dialog for confirmations, warnings, and alerts |
| `MStatusBadge` | Coloured status badge with dot indicator |

### Pad (Native Touch)

| Component | Description |
|---|---|
| `PadDemo` | Self-contained pad cockpit demo with workload cards |
| `PNumericKeypad` | Touch-friendly numeric keypad for data entry |
| `PTable` | Card-based touch table with per-row tap handling |
| `PSmartFilter` | Horizontally scrollable filter bar |
| `usePadLayout` | Hook for orientation detection and adaptive layout |

### WebView Bridges

| Component | Web Path | Description |
|---|---|---|
| `CStandardPage` | `/std-report` | Standard Report with table, filtering, pagination |
| `CKanbanBoard` | `/kanban` | Kanban Board with drag-and-drop |
| `CPivotTable` | `/pivot-table` | Pivot Table with chart rendering |
| `AgentUI` | `/chat` | AI Chat with markdown and card rendering |
| `OrbWebView` | *(custom)* | Generic WebView wrapper — use for any custom page |

---

## Internationalisation (i18n)

Built-in support for 6 locales: `en`, `zh`, `fr`, `de`, `ja`, `ko`.

```tsx
import { OrbmobileI18nProvider } from 'orbmobile-ui';

<OrbmobileI18nProvider locale="zh">
  <App />
</OrbmobileI18nProvider>
```

Inside any component:

```tsx
import { useOrbmobileI18n } from 'orbmobile-ui';

const { t, locale } = useOrbmobileI18n();
// t('common.save') → "保存" (when locale is "zh")
```

---

## Design Tokens

Import design tokens for consistent styling:

```tsx
import { BRAND_COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from 'orbmobile-ui';
```

These tokens mirror the orbcafe-ui visual identity but are expressed as React Native compatible values (numbers and style objects, not Tailwind classes).

---

## Relationship with orbcafe-ui

| | orbcafe-ui (web) | orbmobile-ui (mobile) |
|---|---|---|
| **Platform** | React / Next.js | React Native / Expo |
| **Styling** | Tailwind CSS + MUI | React Native StyleSheet |
| **Complex UIs** | Direct implementation | WebView bridge to orbcafe-ui |
| **Touch UIs** | Pad module (web) | Native Pad components |
| **i18n** | Same 6 locales, same keys | Same 6 locales, same keys |
| **Package** | `orbcafe-ui` on npm | `orbmobile-ui` on npm |

The two libraries are **siblings**: they share the same design language, the same i18n keys, and the same component naming conventions. But they are **independent packages** with no cross-dependency at build time.

When orbmobile-ui uses WebView bridges, it connects at **runtime** to a deployed orbcafe-ui web server — it does not import orbcafe-ui code.

---

## Running the Example App

```bash
cd examples-native
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `i` for the iOS simulator.

> **Note:** WebView-bridged screens require a running orbcafe-ui web server.
> Set the URL via `setOrbmobileBaseUrl()` or leave the default `http://localhost:3000`.

---

## Development

```bash
# Type-check the library
npm run typecheck
```

---

## License

MIT
