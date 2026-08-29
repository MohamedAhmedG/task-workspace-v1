import { cn } from "@/lib/utils"
import { TASK_PRIORITY_STYLES, TASK_STATUS_STYLES } from "@/lib/task-styles"
import {
	TASK_PRIORITY_LABELS,
	TASK_STATUS_LABELS,
	type TaskPriority,
	type TaskStatus,
} from "@/types/task"

type TaskBadgeProps = { status: TaskStatus } | { priority: TaskPriority }

function TaskBadge(props: TaskBadgeProps) {
	const className =
		"status" in props
			? TASK_STATUS_STYLES[props.status]
			: TASK_PRIORITY_STYLES[props.priority]
	const label =
		"status" in props
			? TASK_STATUS_LABELS[props.status]
			: TASK_PRIORITY_LABELS[props.priority]

	return (
		<span
			className={cn(
				"inline-flex text-xs font-medium px-2 py-0.5 rounded-full w-fit",
				className,
			)}
		>
			{label}
		</span>
	)
}

export { TaskBadge }
