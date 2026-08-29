import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import { createTaskSchema, updateTaskSchema } from "@/schemas/task"
import type { Task } from "@/types/task"

import { fixtureTasks } from "./fixtures"

let tasks: Task[] = structuredClone(fixtureTasks)

export function resetTaskStore(seed: Task[] = fixtureTasks) {
  tasks = structuredClone(seed)
}

function jsonError(message: string, status: number) {
  return HttpResponse.json({ error: message }, { status })
}

export const handlers = [
  http.get("/api/tasks", () => HttpResponse.json(tasks)),

  http.post("/api/tasks", async ({ request }) => {
    const parsed = createTaskSchema.safeParse(await request.json())
    if (!parsed.success) return jsonError("Invalid request", 400)
    const now = new Date().toISOString()
    const task: Task = {
      ...parsed.data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    tasks.push(task)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch("/api/tasks/:id", async ({ request, params }) => {
    const parsed = updateTaskSchema.safeParse(await request.json())
    if (!parsed.success) return jsonError("Invalid request", 400)
    const id = String(params.id)
    const index = tasks.findIndex((task) => task.id === id)
    if (index === -1) return jsonError("Task not found", 404)
    tasks[index] = {
      ...tasks[index]!,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(tasks[index])
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const id = String(params.id)
    const index = tasks.findIndex((task) => task.id === id)
    if (index === -1) return jsonError("Task not found", 404)
    tasks.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

export const server = setupServer(...handlers)
