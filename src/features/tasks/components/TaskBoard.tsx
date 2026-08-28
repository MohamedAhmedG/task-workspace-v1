import type { Task, TaskStatus } from '../types/task'
import type { TaskFilters } from '../hooks/useTasksQuery'
import { useTasksQuery } from '../hooks/useTasksQuery'
import { useTaskMutations } from '../hooks/useTaskMutations'
import { TaskColumn } from './TaskColumn'

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'done']

interface TaskBoardProps {
  filters?: TaskFilters
  onEdit: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

export function TaskBoard({ filters, onEdit, onAddTask }: TaskBoardProps) {
  const { tasks, isLoading, isError } = useTasksQuery(filters)
  const { remove } = useTaskMutations()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-sm">Loading tasks…</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600">Failed to load tasks. Please refresh.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2">
      {COLUMNS.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onEdit={onEdit}
          onDelete={(id) => remove.mutate(id)}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  )
}
