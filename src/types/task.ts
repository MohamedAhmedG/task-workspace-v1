export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "in_review",
  "done",
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const

export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}

export const TASK_STATUS_OPTIONS = TASK_STATUSES.map((value) => ({
  value,
  label: TASK_STATUS_LABELS[value],
}))

export const TASK_PRIORITY_OPTIONS = TASK_PRIORITIES.map((value) => ({
  value,
  label: TASK_PRIORITY_LABELS[value],
}))

export function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value)
}

export function isTaskPriority(value: string): value is TaskPriority {
  return TASK_PRIORITIES.some((priority) => priority === value)
}

export const TASK_STATUS_ORDER = Object.fromEntries(
  TASK_STATUSES.map((status, index) => [status, index]),
) as Record<TaskStatus, number>

export const TASK_PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export interface TaskFilters {
  status?: TaskStatus | ""
  priority?: TaskPriority | ""
  q?: string
  from?: string
  to?: string
}

export type TaskSortField = Extract<
  keyof Task,
  "title" | "status" | "priority" | "dueDate" | "createdAt"
>
export type TaskSortDir = "asc" | "desc"
