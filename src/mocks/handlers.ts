import { http, HttpResponse, delay } from "msw"
import type {
	CreateTaskInput,
	UpdateTaskInput,
} from "@/features/tasks/types/task"
import { largeSeedTasks, seedTasks } from "./data"

const useLarge =
	import.meta.env.DEV &&
	typeof localStorage !== "undefined" &&
	localStorage.getItem("large_dataset") === "true"

let tasks = structuredClone(useLarge ? largeSeedTasks : seedTasks)

const DELAY_MS = 400

const shouldFail = () =>
	import.meta.env.DEV &&
	typeof localStorage !== "undefined" &&
	localStorage.getItem("mock_error") === "true"

export const handlers = [
	http.get("/api/tasks", async () => {
		await delay(DELAY_MS)
		if (shouldFail())
			return HttpResponse.json({ error: "Simulated error" }, { status: 500 })
		return HttpResponse.json(tasks)
	}),

	http.post("/api/tasks", async ({ request }) => {
		await delay(DELAY_MS)
		if (shouldFail())
			return HttpResponse.json({ error: "Simulated error" }, { status: 500 })
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

	http.patch("/api/tasks/:id", async ({ request, params }) => {
		await delay(DELAY_MS)
		if (shouldFail())
			return HttpResponse.json({ error: "Simulated error" }, { status: 500 })
		const id = params["id"] as string
		const body = (await request.json()) as UpdateTaskInput
		const index = tasks.findIndex((t) => t.id === id)
		if (index === -1) {
			return HttpResponse.json({ error: "Task not found" }, { status: 404 })
		}
		tasks[index] = {
			...tasks[index]!,
			...body,
			updatedAt: new Date().toISOString(),
		}
		return HttpResponse.json(tasks[index])
	}),

	http.delete("/api/tasks/:id", async ({ params }) => {
		await delay(DELAY_MS)
		if (shouldFail())
			return HttpResponse.json({ error: "Simulated error" }, { status: 500 })
		const id = params["id"] as string
		const index = tasks.findIndex((t) => t.id === id)
		if (index === -1) {
			return HttpResponse.json({ error: "Task not found" }, { status: 404 })
		}
		tasks.splice(index, 1)
		return new HttpResponse(null, { status: 204 })
	}),
]
