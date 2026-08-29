import { delay, http, HttpResponse } from "msw"

import {
	insertTask,
	listTasks,
	patchTask,
	removeTask,
	shouldSimulateError,
} from "./store"
import type { CreateTaskInput, UpdateTaskInput } from "@/types/task"

const DELAY_MS = 400

function jsonError(message: string, status: number) {
	return HttpResponse.json({ error: message }, { status })
}

async function withMock(respond: () => Response | Promise<Response>) {
	await delay(DELAY_MS)
	if (shouldSimulateError()) return jsonError("Simulated error", 500)
	return respond()
}

export const handlers = [
	http.get("/api/tasks", () => withMock(() => HttpResponse.json(listTasks()))),

	http.post("/api/tasks", async ({ request }) =>
		withMock(async () => {
			const body = (await request.json()) as CreateTaskInput
			return HttpResponse.json(insertTask(body), { status: 201 })
		}),
	),

	http.patch("/api/tasks/:id", async ({ request, params }) =>
		withMock(async () => {
			const body = (await request.json()) as UpdateTaskInput
			const task = patchTask(String(params.id), body)
			if (!task) return jsonError("Task not found", 404)
			return HttpResponse.json(task)
		}),
	),

	http.delete("/api/tasks/:id", ({ params }) =>
		withMock(() => {
			if (!removeTask(String(params.id))) return jsonError("Task not found", 404)
			return new HttpResponse(null, { status: 204 })
		}),
	),
]
