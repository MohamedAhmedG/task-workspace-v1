import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { TASK_STATUS_DOTS } from "@/lib/task-styles"
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from "@/types/task"
import { TaskCard } from "./TaskCard"

interface TaskColumnProps {
	status: TaskStatus
	tasks: Task[]
	onEdit: (task: Task) => void
	onDelete: (id: string) => void
	onAddTask: (status: TaskStatus) => void
}

export const TaskColumn = memo(function TaskColumn({
	status,
	tasks,
	onEdit,
	onDelete,
	onAddTask,
}: TaskColumnProps) {
	const label = TASK_STATUS_LABELS[status]
	const taskIds = tasks.map((t) => t.id)

	const { setNodeRef, isOver } = useDroppable({ id: status })

	return (
		<div className='shrink-0 w-75 flex flex-col bg-gray-50 rounded-xl border border-gray-200'>
			<div className='px-4 py-3 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<span className={`w-2 h-2 rounded-full ${TASK_STATUS_DOTS[status]}`} />
					<h2 className='text-sm font-medium text-gray-900'>{label}</h2>
					<span className='text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5 font-medium'>
						{tasks.length}
					</span>
				</div>
				<button
					type='button'
					aria-label={`Add task to ${label}`}
					className='text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded p-1 transition-colors'
					onClick={() => onAddTask(status)}
				>
					<Plus size={16} aria-hidden='true' />
				</button>
			</div>

			<SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
				<div
					ref={setNodeRef}
					role='list'
					aria-label={`${label} tasks`}
					className={`flex-1 p-3 space-y-2.5 min-h-30 rounded-b-xl transition-colors ${
						isOver ? "bg-blue-50/60" : ""
					}`}
				>
					{tasks.length === 0 ? (
						<div
							className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors ${
								isOver ? "border-blue-300 bg-blue-50" : "border-gray-200"
							}`}
						>
							<span className='text-xs text-gray-400'>
								{isOver ? "Drop here" : "No tasks"}
							</span>
						</div>
					) : (
						tasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						))
					)}
				</div>
			</SortableContext>
		</div>
	)
})
