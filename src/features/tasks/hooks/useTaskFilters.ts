import { useSearchParams } from 'react-router-dom'
import type { TaskPriority, TaskStatus } from '../types/task'
import type { TaskFilters } from './useTasksQuery'

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: TaskFilters = {
    q: searchParams.get('q') ?? '',
    status: (searchParams.get('status') as TaskStatus) ?? '',
    priority: (searchParams.get('priority') as TaskPriority) ?? '',
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
  }

  const setFilter = (key: keyof TaskFilters, value: string) => {
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

  const hasActiveFilters = !!(
    filters.q ||
    filters.status ||
    filters.priority ||
    filters.from ||
    filters.to
  )

  return { filters, setFilter, clearFilters, hasActiveFilters }
}
