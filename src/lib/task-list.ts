import type { TaskSortField } from "@/types/task"

export const TASK_LIST_ROW_HEIGHT = 60

export const TASK_LIST_ROW_GRID =
  "grid grid-cols-[1fr_128px_112px_112px_112px_80px] gap-4 px-4"

export const TASK_SORT_COLUMNS: { field: TaskSortField; label: string }[] = [
  { field: "title", label: "Task" },
  { field: "status", label: "Status" },
  { field: "priority", label: "Priority" },
  { field: "dueDate", label: "Due Date" },
  { field: "createdAt", label: "Created" },
]
