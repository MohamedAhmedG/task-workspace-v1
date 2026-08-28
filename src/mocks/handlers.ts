import { http, HttpResponse } from 'msw'
import type { CreateTaskInput, UpdateTaskInput } from '@/features/tasks/types/task'
import { seedTasks } from './data'

let tasks = structuredClone(seedTasks)

export const handlers = [
  http.get('/api/tasks', () => {
    return HttpResponse.json(tasks)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as CreateTaskInput
    const now = new Date().toISOString()
    const task = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    tasks.push(task)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch('/api/tasks/:id', async ({ request, params }) => {
    const id = params['id'] as string
    const body = (await request.json()) as UpdateTaskInput
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    tasks[index] = {
      ...tasks[index]!,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(tasks[index])
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    const id = params['id'] as string
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    tasks.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
