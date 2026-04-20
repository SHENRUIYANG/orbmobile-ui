# Kanban

`Kanban/` exposes the native Kanban board for mobile and pad layouts.

## Public API

- `MKanbanBoard`
- `MKanbanBoardProps`
- `MKanbanBucketData`
- `MKanbanCardData`
- `MKanbanCardFact`
- `MKanbanCardMoveEvent`

## Intent

- Keep the Kanban surface native in React Native
- Support touch-friendly bucket lanes and compact task cards on both phone and pad
- Let examples pass local bucket/card data into the board instead of depending on a paired web app

## Data model

- `MKanbanBucketData`
  - `id`, `title`, `cards` are required
  - `subtitle`, `accentColor`, `limit`, `cardStatus`, and `cardStatusLabel` are optional
- `MKanbanCardData`
  - `id` and `title` are required
  - `description`, `status`, `statusLabel`, `tags`, and `facts` are optional
- `MKanbanCardFact`
  - simple `{ label, value }` metadata row rendered inside the card

## Behavior

- The board is a native React Native composition, not a WebView wrapper
- The full board scrolls horizontally across buckets
- Each bucket has its own vertical scroll area for cards
- Cards can move to any bucket through the built-in bucket selector modal
- If the target bucket defines `cardStatus` or `cardStatusLabel`, the moved card inherits that stage state
- `onBucketsChange` receives the next board state after a move
- `onCardMove` receives the moved card plus source and target bucket details

## Layout notes

- Phone and pad share the same component, with responsive bucket width and header spacing
- The header avoids the floating navigation affordance used by the example app
- Bucket height is capped so long columns stay scrollable instead of stretching the whole screen

## Example

```tsx
import React from 'react';
import {
  MKanbanBoard,
  type MKanbanBucketData,
  type MKanbanCardMoveEvent,
} from 'orbmobile-ui';

const buckets: MKanbanBucketData[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    subtitle: 'Waiting for commitment',
    cards: [
      {
        id: 'task-1',
        title: 'Review replenishment plan',
        facts: [{ label: 'Owner', value: 'Amy' }],
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cardStatus: 'success',
    cardStatusLabel: 'Done',
    cards: [],
  },
];

export function KanbanScreen() {
  const handleCardMove = (event: MKanbanCardMoveEvent) => {
    console.log(event.fromBucket.title, '->', event.toBucket.title, event.card.title);
  };

  return (
    <MKanbanBoard
      title="KANBAN BOARD"
      subtitle="Touch-first board demo."
      buckets={buckets}
      onCardMove={handleCardMove}
    />
  );
}
```

## Verification

- Root: `npm run typecheck`
- Manual: open `examples-native/src/screens/KanbanScreen.tsx` on both phone and pad simulators
- Confirm horizontal board scroll, per-bucket vertical scroll, and bucket move modal behavior
