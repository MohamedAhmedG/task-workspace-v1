import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { Task } from '../types/task'

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
} satisfies Record<Task['priority'], string>

const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} satisfies Record<Task['priority'], string>

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        aria-hidden="true"
        className="h-25 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/40"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      aria-label={task.title}
      className="group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing"
      onClick={() => onEdit(task)}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
        <button
          type="button"
          aria-label={`Delete "${task.title}"`}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0 -mt-0.5 -mr-0.5 p-0.5 rounded"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-2xl rotate-2 cursor-grabbing">
      <div className="flex items-start gap-2 mb-2">
        <span
          className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  )
}
