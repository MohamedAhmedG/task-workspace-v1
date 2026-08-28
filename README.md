# TaskFlow — Interactive Task & Workflow Workspace

A kanban-style task management app built as a React take-home assessment.

---

## Quick start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Mock API responses are served by [MSW](https://mswjs.io/) — no backend required.

```bash
npm run build      # production build
```

---

## Stack

| Concern | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (nova style) |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Mock API | MSW v2 |
| Forms | React Hook Form + Zod |
| Drag and drop | dnd-kit |
| Virtualization | TanStack Virtual v3 |
| Toasts | Sonner |

---

## Features

**Board view** — Kanban board with To Do / In Progress / Done columns.
- Click a card to edit it
- Drag a card to a different column to change its status (persisted via PATCH)
- Drag a card within a column to reorder it (display-only, not persisted)
- Delete with confirmation via the per-card trash icon

**List view** — Flat table of all tasks.
- Sortable columns: title, status, priority, date created
- Virtualized with TanStack Virtual (efficient at any scale)
- Same edit/delete actions as the board

**Filters** — Shared across both views via URL search params.
- Free-text search across title and description
- Status filter (To Do / In Progress / Done)
- Priority filter (Low / Medium / High)
- Filters are bookmarkable and survives navigation

**Forms** — Create and edit tasks with validation.
- Title (required, max 100 chars)
- Description (optional, max 500 chars)
- Status and priority selects

---

## Architecture

```
src/
├── app/
│   └── providers.tsx         # QueryClientProvider + Sonner Toaster
├── components/
│   ├── Layout.tsx             # Nav header + Outlet
│   └── ui/                   # shadcn/ui primitives
├── features/
│   └── tasks/
│       ├── api/tasks.ts       # fetch wrappers: getTasks, createTask, updateTask, deleteTask
│       ├── components/        # TaskBoard, TaskColumn, TaskCard, TaskFormDialog, TaskFilters
│       ├── hooks/
│       │   ├── useTasksQuery.ts    # TanStack Query + client-side filter
│       │   ├── useTaskMutations.ts # create/update/delete mutations with toasts
│       │   └── useTaskFilters.ts   # reads/writes q|status|priority URL params
│       ├── schemas/task.ts    # Zod schemas + TaskFormValues type
│       └── types/task.ts      # Task, TaskStatus, TaskPriority, input types
├── lib/utils.ts               # cn() helper (clsx + tailwind-merge)
├── mocks/
│   ├── browser.ts             # MSW browser worker setup
│   ├── handlers.ts            # GET/POST/PATCH/DELETE /api/tasks
│   └── data.ts                # 12 seed tasks
├── pages/
│   ├── BoardPage.tsx
│   └── ListPage.tsx
└── routes/index.tsx
```

### State ownership

- **Server state** — TanStack Query owns all task data. Nothing is duplicated in `useState` or a separate store.
- **Filter / search state** — Lives in URL search params (`?q=&status=&priority=`). Both views read the same params, making filters shareable and bookmarkable.
- **UI state** — Local `useState` in the component that owns it (dialog open/close, sort field, active drag item). Nothing is lifted unnecessarily.
- **Zustand** — Not introduced. There was no cross-feature shared client state that required it.

### Drag and drop

Cross-column drags (status changes) use an optimistic update pattern:

1. Snapshot the current query cache.
2. Apply the status change directly to the cache.
3. Send `PATCH /api/tasks/:id` to the server.
4. On success — invalidate the query so the cache re-syncs with the server.
5. On error — restore the snapshot and show an error toast.

Within-column reordering uses `arrayMove` on the cache only. Order is not persisted to the server (no `order` field in the task schema). The display order resets on hard refresh — acknowledged as a display-only feature.

---

## Trade-offs and known limitations

**Within-column sort order is not persisted.** Adding a persistent `order` field would require either a bulk reorder endpoint (`PUT /api/tasks/reorder`) or fractional indexing. Both are non-trivial and were out of scope for this assessment.

**Chunk size warning in production build.** The single JS bundle is ~640 kB minified. This is expected for a SPA that bundles all routes upfront. Code splitting with lazy-loaded routes would reduce initial load time in production.

**shadcn init placed files in a literal `@/` directory.** During setup, `npx shadcn@latest init` did not resolve the `@` path alias and created files at `@/components/ui/` instead of `src/components/ui/`. Files were manually moved to the correct location.

**MSW mock data resets on page refresh.** The in-memory mock store (`tasks` array in `handlers.ts`) is re-initialized from `seedTasks` on every full page reload. This is intentional for a demo environment — no backend persistence is expected.

**Automated testing** is planned as a dedicated follow-up phase covering critical user flows (CRUD, filtering, drag-and-drop interactions).
