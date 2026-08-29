import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTask, deleteTask, updateTask } from '@/api'
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/types/task'

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
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((t) =>
          t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
        ) ?? []
      )
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
      toast.error('Failed to update task')
    },
    onSuccess: () => {
      toast.success('Task updated')
    },
    onSettled: () => {
      invalidate()
    },
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
