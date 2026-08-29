import { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '@/types/task'
import { TaskCard } from './TaskCard'

const COLUMN_CONFIG = {
  todo: { label: 'To Do', dotClass: 'bg-slate-400' },
  in_progress: { label: 'In Progress', dotClass: 'bg-blue-400' },
  in_review: { label: 'In Review', dotClass: 'bg-yellow-400' },
  done: { label: 'Done', dotClass: 'bg-emerald-400' },
} satisfies Record<TaskStatus, { label: string; dotClass: string }>

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: (status: TaskStatus) => void
}

export const TaskColumn = memo(function TaskColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onAddTask,
}: TaskColumnProps) {
  const config = COLUMN_CONFIG[status]
  const taskIds = tasks.map((t) => t.id)

  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="shrink-0 w-75 flex flex-col bg-gray-50 rounded-xl border border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
          <h2 className="text-sm font-medium text-gray-900">
            {config.label}
          </h2>
          <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5 font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Add task to ${config.label}`}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded p-1 transition-colors"
          onClick={() => onAddTask(status)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          role="list"
          aria-label={`${config.label} tasks`}
          className={`flex-1 p-3 space-y-2.5 min-h-30 rounded-b-xl transition-colors ${
            isOver ? 'bg-blue-50/60' : ''
          }`}
        >
          {tasks.length === 0 ? (
            <div
              className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors ${
                isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <span className="text-xs text-gray-400">
                {isOver ? 'Drop here' : 'No tasks'}
              </span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
})
