import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTasks } from "@/api"
import { filterTasks } from "@/lib/task-filter"
import type { TaskFilters } from "@/types/task"

export function useTasksQuery(filters: TaskFilters = {}) {
	const query = useQuery({
		queryKey: ["tasks"],
		queryFn: getTasks,
	})

	const { status = "", priority = "", q = "", from = "", to = "" } = filters

	const tasks = useMemo(
		() => filterTasks(query.data ?? [], { status, priority, q, from, to }),
		[query.data, status, priority, q, from, to],
	)

	return { ...query, tasks }
}
