# TaskFlow — Interactive Task & Workflow Workspace

A kanban-style task management app built as a React take-home assessment.

---

## Quick start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Mock API responses are served by [MSW](https://mswjs.io/) — no backend required.

MSW also starts in production builds so the same mock API works on Vercel/Netlify demos.

```bash
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # oxlint
```

---

## Stack

| Concern | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (nova / Base UI) |
| Routing | React Router v7 |
| HTTP | Axios (`baseURL: /api`, 10s timeout) |
| Server state | TanStack Query v5 |
| Mock API | MSW v2 |
| Forms | React Hook Form + Zod |
| Drag and drop | dnd-kit (pointer + keyboard) |
| Virtualization | TanStack Virtual v3 |
| Toasts | Sonner |
| Lint | oxlint |

---

## Features

**Board view** — Kanban board with To Do / In Progress / In Review / Done columns.
- Click a card (or the header **New task** button) to create or edit
- Add a task to a specific column from the column header
- Drag a card to a different column to change its status (optimistic PATCH)
- Keyboard drag is supported (dnd-kit `KeyboardSensor`)
- Delete with confirmation via the per-card trash icon

**List view** — Flat table of all tasks.
- Sortable columns: title, status, priority, due date, date created (`aria-sort` on the active column)
- Virtualized with TanStack Virtual
- Same create / edit / delete actions as the board

**Filters** — Shared across both views via URL search params.
- Debounced free-text search across title and description (`trimEnd` on commit)
- Status filter (To Do / In Progress / In Review / Done)
- Priority filter (Low / Medium / High / Urgent)
- Inclusive due-date From / To range
- Bookmarkable URLs; Board/List navigation keeps the same params
- Filtering is **client-side** after a single `GET /api/tasks`

**Forms** — Create and edit tasks with validation (Zod + React Hook Form).
- Title (required, max 100 chars)
- Description (optional, max 500 chars)
- Status, priority, and due date (due date required)

**Errors** — Route render failures use React Router `errorElement` (`RouteError`). The recovery action navigates home (`/`).

---

## Architecture

```
src/
├── main.tsx                  # MSW, QueryClientProvider, Toaster, render
├── api/
│   ├── get-tasks.ts
│   ├── create-task.ts
│   ├── update-task.ts
│   ├── delete-task.ts
│   └── index.ts
├── hooks/
│   ├── useTasksQuery.ts
│   ├── useTaskMutations.ts
│   └── useTaskFilters.ts
├── schemas/
│   └── task.ts               # Zod create/update schemas
├── types/
│   └── task.ts               # Task types, status/priority options, labels, sort order
├── components/
│   ├── Layout/
│   │   ├── Header.tsx        # Board/List nav from routes/paths
│   │   └── index.tsx         # Header + <Outlet />
│   ├── tasks/                # TaskBoard, TaskList, TaskColumn, TaskCard, TaskBadge,
│   │                         # TaskFormDialog, TaskFilters, TaskDeleteDialog
│   └── ui/                   # composed shadcn primitives (Select, Dialog, AlertDialog, …)
├── lib/
│   ├── api-client.ts         # shared Axios instance (baseURL: /api)
│   ├── task-list.ts          # list table columns + row layout
│   ├── task-styles.ts        # status/priority badges + column dots
│   └── utils.ts
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts           # GET/POST/PATCH/DELETE /api/tasks
│   └── data.ts
├── pages/
│   ├── BoardPage.tsx
│   └── ListPage.tsx
└── routes/
    ├── PageFallback.tsx      # Suspense fallback for lazy pages
    ├── RouteError.tsx        # router errorElement
    ├── paths.ts              # ROUTES + navLinks
    └── index.tsx             # createBrowserRouter, lazy Board/List
```

`api`, `hooks`, `schemas`, and `types` live at `src/` so they are app-wide. Task UI lives in `src/components/tasks/`.

Status and priority **values and labels** are defined once in `src/types/task.ts` (`TASK_STATUS_OPTIONS`, `TASK_PRIORITY_OPTIONS`, and the derived `LABELS` / `TASK_STATUSES`). Forms, filters, the board columns, and the list badges all read from there. Colors (badges and column dots) live in `src/lib/task-styles.ts`.

### Routing

`src/routes/paths.ts` is the single source of truth for app paths and header links:

```ts
export const ROUTES = {
  board: '/',
  list: '/list',
}

export const navLinks = [
  { to: ROUTES.board, label: 'Board' },
  { to: ROUTES.list, label: 'List' },
]
```

The router uses `ROUTES` for `path`. `Header` imports `navLinks` directly — no hardcoded `/list` in the layout.

Board and List pages are lazy-loaded with `React.lazy` + `Suspense` (`PageFallback` while the chunk loads). The layout route sets `errorElement: <RouteError />`.

### HTTP

```
TanStack Query hooks
  → api/*
  → lib/api-client.ts (Axios, baseURL /api)
  → MSW (400ms delay)
```

Hooks never import Axios. Task API functions return `response.data` (or `void` for delete). Axios rejects 4xx/5xx, which TanStack Query surfaces as query/mutation errors.

`useTasksQuery` always fetches the full list (`queryKey: ['tasks']`) and applies URL filters in memory.

### State ownership

- **Server state** — TanStack Query owns all task data. Nothing is duplicated in `useState` or a separate store.
- **Filter / search state** — Lives in URL search params (`?q=&status=&priority=&from=&to=`). Both views read the same params via `useTaskFilters`.
- **UI state** — Local `useState` in the component that owns it (dialog open/close, sort field, active drag item).
- **Zustand** — Not introduced. There was no cross-feature shared client state that required it.

Query defaults (in `main.tsx`): `staleTime` 1 minute, `retry: 1`.

### Drag and drop

Cross-column drags change status through the same `updateTask()` mutation used by the edit form:

1. Snapshot the current query cache.
2. Apply the status change directly to the cache.
3. Send `PATCH /api/tasks/:id`.
4. On success — invalidate the query so the cache re-syncs.
5. On error — restore the snapshot and show an error toast.

Same-column dragging does not persist a manual order. Order is not part of the task model.

Create and delete are not optimistic — they invalidate `['tasks']` after success.

Board and List share `TaskDeleteDialog` for the confirm step.

### Accessibility

- Named controls: search, status/priority filters, drag handle, delete, column “add task”
- Form fields expose `aria-invalid` / `aria-describedby` for validation errors
- List sort headers set `aria-sort`
- Header nav uses `aria-current="page"`
- Keyboard dragging on the board via dnd-kit

---

## Trade-offs and known limitations

**MSW mock data resets on page refresh.** The in-memory mock store (`tasks` array in `handlers.ts`) is re-initialized from `seedTasks` on every full page reload. This is intentional for a demo environment — no backend persistence is expected.

**Development-only helpers.** In local development, `localStorage.setItem('mock_error', 'true')` simulates API failures, and `localStorage.setItem('large_dataset', 'true')` loads 1,000 generated tasks. Production builds ignore both flags.

**Filtering is client-side.** The mock API has no query-string contract, so the client downloads all tasks once and filters locally. Fine for this dataset size; a real backend would filter on the server.

**shadcn init placed files in a literal `@/` directory.** During setup, `npx shadcn@latest init` did not resolve the `@` path alias and created files at `@/components/ui/` instead of `src/components/ui/`. Files were manually moved to the correct location.

**Automated testing** is planned as a dedicated follow-up phase covering critical user flows (CRUD, filtering, drag-and-drop interactions).
