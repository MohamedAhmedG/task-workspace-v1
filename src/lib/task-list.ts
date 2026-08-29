import {
	TASK_PRIORITY_ORDER,
	TASK_STATUS_ORDER,
	type Task,
	type TaskSortDir,
	type TaskSortField,
} from "@/types/task"

export const TASK_LIST_ROW_HEIGHT = 60

export const TASK_LIST_ROW_GRID =
	"grid grid-cols-[1fr_128px_112px_112px_112px_80px] gap-4 px-4"

export const TASK_SORT_COLUMNS: { field: TaskSortField; label: string }[] = [
	{ field: "title", label: "Task" },
	{ field: "status", label: "Status" },
	{ field: "priority", label: "Priority" },
	{ field: "dueDate", label: "Due Date" },
	{ field: "createdAt", label: "Created" },
]

export function sortTasks(
	tasks: Task[],
	field: TaskSortField,
	dir: TaskSortDir,
): Task[] {
	return [...tasks].sort((a, b) => {
		let cmp = 0
		switch (field) {
			case "title":
				cmp = a.title.localeCompare(b.title)
				break
			case "priority":
				cmp = TASK_PRIORITY_ORDER[a.priority] - TASK_PRIORITY_ORDER[b.priority]
				break
			case "status":
				cmp = TASK_STATUS_ORDER[a.status] - TASK_STATUS_ORDER[b.status]
				break
			case "dueDate":
				cmp = a.dueDate.localeCompare(b.dueDate)
				break
			case "createdAt":
				cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				break
		}
		return dir === "asc" ? cmp : -cmp
	})
}
