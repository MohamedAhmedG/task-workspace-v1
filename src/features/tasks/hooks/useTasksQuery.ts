import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTasks } from "../api"
import type { TaskPriority, TaskStatus } from "../types/task"

export interface TaskFilters {
	status?: TaskStatus | ""
	priority?: TaskPriority | ""
	q?: string
	from?: string
	to?: string
}

export function useTasksQuery(filters: TaskFilters = {}) {
	const { status = "", priority = "", q = "", from = "", to = "" } = filters

	const query = useQuery({
		queryKey: ["tasks"],
		queryFn: getTasks,
	})

	const tasks = useMemo(() => {
		const all = query.data ?? []
		return all.filter((task) => {
			if (status && task.status !== status) return false
			if (priority && task.priority !== priority) return false
			if (from && task.dueDate < from) return false
			if (to && task.dueDate > to) return false
			if (q) {
				const lower = q.toLowerCase()
				return (
					task.title.toLowerCase().includes(lower) ||
					task.description.toLowerCase().includes(lower)
				)
			}
			return true
		})
	}, [query.data, status, priority, from, to, q])

	return { ...query, tasks }
}
