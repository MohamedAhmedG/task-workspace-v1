import type { Task, TaskFilters } from "@/types/task"

export function hasActiveFilters(filters: TaskFilters): boolean {
  return !!(
    filters.q ||
    filters.status ||
    filters.priority ||
    filters.from ||
    filters.to
  )
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const { status = "", priority = "", q = "", from = "", to = "" } = filters

  return tasks.filter((task) => {
    if (status && task.status !== status) return false
    if (priority && task.priority !== priority) return false
    if (from && task.dueDate < from) return false
    if (to && task.dueDate > to) return false
    if (q) {
      const lower = q.toLowerCase()
      return (
        task.title.toLowerCase().includes(lower) ||
        task.description.toLowerCase().includes(lower)
      )
    }
    return true
  })
}
