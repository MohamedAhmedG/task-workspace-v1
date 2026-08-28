import { apiClient } from '@/lib/api-client'
import type { Task } from '../types/task'

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get<Task[]>('/tasks')
  return response.data
}
