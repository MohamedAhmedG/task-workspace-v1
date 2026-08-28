import { useSearchParams } from 'react-router-dom'
import type { TaskPriority, TaskStatus } from '../types/task'

export interface TaskFilterValues {
  q: string
  status: TaskStatus | ''
  priority: TaskPriority | ''
}

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: TaskFilterValues = {
    q: searchParams.get('q') ?? '',
    status: (searchParams.get('status') as TaskStatus) ?? '',
    priority: (searchParams.get('priority') as TaskPriority) ?? '',
  }

  const setFilter = (key: keyof TaskFilterValues, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  const clearFilters = () => setSearchParams({}, { replace: true })

  const hasActiveFilters = !!(filters.q || filters.status || filters.priority)

  return { filters, setFilter, clearFilters, hasActiveFilters }
}
