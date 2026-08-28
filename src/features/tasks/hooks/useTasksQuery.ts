import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/tasks'
import type { TaskPriority, TaskStatus } from '../types/task'

export interface TaskFilters {
  status?: TaskStatus | ''
  priority?: TaskPriority | ''
  q?: string
}

export function useTasksQuery(filters: TaskFilters = {}) {
  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const allTasks = query.data ?? []

  const tasks = allTasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.q) {
      const q = filters.q.toLowerCase()
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  return { ...query, tasks }
}
