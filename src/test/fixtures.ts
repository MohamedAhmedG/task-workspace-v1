import type { Task } from "@/types/task"

export const fixtureTasks: Task[] = [
  {
    id: "1",
    title: "Design system audit",
    description: "Review existing components",
    status: "todo",
    priority: "high",
    dueDate: "2026-09-01",
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
  },
  {
    id: "2",
    title: "Write unit tests",
    description: "Cover the design handbook",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-09-10",
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: "2026-08-21T10:00:00Z",
  },
  {
    id: "3",
    title: "Migrate database schema",
    description: "Add indexes for search",
    status: "in_review",
    priority: "urgent",
    dueDate: "2026-09-05",
    createdAt: "2026-08-22T11:00:00Z",
    updatedAt: "2026-08-22T11:00:00Z",
  },
  {
    id: "4",
    title: "Fix pagination bug",
    description: "Last page count is wrong",
    status: "done",
    priority: "low",
    dueDate: "2026-08-20",
    createdAt: "2026-08-18T09:00:00Z",
    updatedAt: "2026-08-19T16:00:00Z",
  },
  {
    id: "5",
    title: "Original",
    description: "Task used for edit rollback",
    status: "todo",
    priority: "urgent",
    dueDate: "2026-09-15",
    createdAt: "2026-08-23T08:00:00Z",
    updatedAt: "2026-08-23T08:00:00Z",
  },
]

export const validTaskInput = {
  title: "Ship review notes",
  description: "Ready for stakeholders",
  status: "in_review" as const,
  priority: "urgent" as const,
  dueDate: "2026-09-15",
}
