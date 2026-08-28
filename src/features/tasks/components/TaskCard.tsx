import { memo } from 'react'
import { Calendar, GripVertical } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { formatDate } from '@/lib/utils'
import type { Task } from '../types/task'

const PRIORITY_STYLES = {
  urgent: 'bg-red-600 text-white',
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
} satisfies Record<Task['priority'], string>

const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} satisfies Record<Task['priority'], string>

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
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
      role="listitem"
      className="group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>

        <div className="flex items-center gap-0.5 -mt-0.5 -mr-0.5 shrink-0">
          <button
            type="button"
            ref={setActivatorNodeRef}
            aria-label={`Drag "${task.title}"`}
            className="p-0.5 text-gray-300 hover:text-gray-500 rounded opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-grab active:cursor-grabbing touch-none transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            onClick={(e) => e.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label={`Delete "${task.title}"`}
            className="p-0.5 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
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
      </div>

      <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1.5">
        <button
          type="button"
          className="text-left w-full line-clamp-2 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(task)
          }}
        >
          {task.title}
        </button>
      </h3>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
          <Calendar size={11} aria-hidden="true" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  )
})

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
