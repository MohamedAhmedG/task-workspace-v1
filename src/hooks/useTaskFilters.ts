import { useSearchParams } from "react-router-dom"
import { hasActiveFilters } from "@/lib/task-filter"
import {
	isTaskPriority,
	isTaskStatus,
	type TaskFilters,
	type TaskPriority,
	type TaskStatus,
} from "@/types/task"

function parseStatus(value: string | null): TaskStatus | "" {
	return value && isTaskStatus(value) ? value : ""
}

function parsePriority(value: string | null): TaskPriority | "" {
	return value && isTaskPriority(value) ? value : ""
}

export function useTaskFilters() {
	const [searchParams, setSearchParams] = useSearchParams()

	const filters: TaskFilters = {
		q: searchParams.get("q") ?? "",
		status: parseStatus(searchParams.get("status")),
		priority: parsePriority(searchParams.get("priority")),
		from: searchParams.get("from") ?? "",
		to: searchParams.get("to") ?? "",
	}

	const setFilter = (key: keyof TaskFilters, value: string) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev)
				if (value) next.set(key, value)
				else next.delete(key)
				return next
			},
			{ replace: true },
		)
	}

	const clearFilters = () => setSearchParams({}, { replace: true })

	return {
		filters,
		setFilter,
		clearFilters,
		hasActiveFilters: hasActiveFilters(filters),
	}
}
