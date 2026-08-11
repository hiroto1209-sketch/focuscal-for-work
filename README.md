# FocusCal v6

UI-first rebuild of FocusCal around the approved architecture: TypeScript + React + Vite + Zustand + IndexedDB/Dexie candidate + PWA.

## Current slice
- Premium dark calendar UI, responsive for desktop/mobile
- Month navigation and today navigation
- Daily agenda with task completion
- Create/edit/delete event sheet
- Category and priority controls
- Completion feedback and monthly focus metrics
- Theme switching
- JSON backup export
- Local persistence with a migration-friendly state shape
- PWA service worker with runtime caching

## Architecture direction
`Task` and `Schedule` are kept conceptually separate, while completion is a first-class state transition. The current UI slice intentionally keeps the domain small enough to iterate quickly before adding recurrence, sync, notifications, and richer achievements.

## Development

```bash
npm install
npm run dev
```

The project is designed for the next phase to move persistence fully behind a repository layer using Dexie/IndexedDB, without coupling UI components to storage.
