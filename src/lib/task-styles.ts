import type { TaskPriority, TaskStatus } from '@/types/task'

export const TASK_PRIORITY_STYLES: Record<TaskPriority, string> = {
  urgent: 'bg-red-600 text-white',
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
}

export const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  done: 'bg-emerald-100 text-emerald-700',
}

export const TASK_STATUS_DOTS: Record<TaskStatus, string> = {
  todo: 'bg-slate-400',
  in_progress: 'bg-blue-400',
  in_review: 'bg-yellow-400',
  done: 'bg-emerald-400',
}
