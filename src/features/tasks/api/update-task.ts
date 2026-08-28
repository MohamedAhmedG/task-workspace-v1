import { apiClient } from '@/lib/api-client'
import type { Task, UpdateTaskInput } from '../types/task'

export async function updateTask(
  id: string,
  data: UpdateTaskInput,
): Promise<Task> {
  const response = await apiClient.patch<Task>(`/tasks/${id}`, data)
  return response.data
}
