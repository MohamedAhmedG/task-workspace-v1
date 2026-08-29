import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task"
import { largeSeedTasks, seedTasks } from "./data"

function isDevFlag(key: "large_dataset" | "mock_error") {
	return (
		import.meta.env.DEV &&
		typeof localStorage !== "undefined" &&
		localStorage.getItem(key) === "true"
	)
}

let tasks: Task[] = structuredClone(
	isDevFlag("large_dataset") ? largeSeedTasks : seedTasks,
)

export function shouldSimulateError() {
	return isDevFlag("mock_error")
}

export function listTasks() {
	return tasks
}

export function insertTask(input: CreateTaskInput): Task {
	const now = new Date().toISOString()
	const task: Task = {
		...input,
		id: crypto.randomUUID(),
		createdAt: now,
		updatedAt: now,
	}
	tasks.push(task)
	return task
}

export function patchTask(id: string, input: UpdateTaskInput) {
	const index = tasks.findIndex((task) => task.id === id)
	if (index === -1) return undefined
	tasks[index] = {
		...tasks[index]!,
		...input,
		updatedAt: new Date().toISOString(),
	}
	return tasks[index]
}

export function removeTask(id: string) {
	const index = tasks.findIndex((task) => task.id === id)
	if (index === -1) return false
	tasks.splice(index, 1)
	return true
}
