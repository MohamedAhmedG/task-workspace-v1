import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTask, deleteTask, updateTask } from '../api/tasks'
import type { CreateTaskInput, UpdateTaskInput } from '../types/task'

export function useTaskMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })

  const create = useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: () => {
      toast.success('Task created')
      invalidate()
    },
    onError: () => toast.error('Failed to create task'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onSuccess: () => {
      toast.success('Task updated')
      invalidate()
    },
    onError: () => toast.error('Failed to update task'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted')
      invalidate()
    },
    onError: () => toast.error('Failed to delete task'),
  })

  return { create, update, remove }
}
