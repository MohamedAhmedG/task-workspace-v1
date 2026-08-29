import { apiClient } from '@/lib/api-client'
import type { CreateTaskInput, Task } from '@/types/task'

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await apiClient.post<Task>('/tasks', data)
  return response.data
}
