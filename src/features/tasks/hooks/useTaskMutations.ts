import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, updateTask } from '../api/tasks'
import type { CreateTaskInput, UpdateTaskInput } from '../types/task'

export function useTaskMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })

  const create = useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
