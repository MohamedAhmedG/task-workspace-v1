import { useCallback, useState } from "react"
import { TaskBoard } from "@/components/tasks/TaskBoard"
import { TaskFilters } from "@/components/tasks/TaskFilters"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"
import { useTaskFilters } from "@/hooks/useTaskFilters"
import type { Task, TaskStatus } from "@/types/task"

export function BoardPage() {
	const { filters } = useTaskFilters()
	const [formOpen, setFormOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<Task | null>(null)
	const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo")

	const handleEdit = useCallback((task: Task) => {
		setEditingTask(task)
		setFormOpen(true)
	}, [])

	const handleAddTask = useCallback((status: TaskStatus) => {
		setEditingTask(null)
		setDefaultStatus(status)
		setFormOpen(true)
	}, [])

	const handleClose = useCallback(() => {
		setFormOpen(false)
		setEditingTask(null)
	}, [])

	return (
		<div className='h-full flex flex-col p-4 sm:p-6 gap-4 overflow-hidden'>
			<div className='flex items-center justify-between shrink-0'>
				<div>
					<h1 className='text-xl font-semibold text-gray-900'>Board</h1>
					<p className='text-sm text-gray-500 mt-0.5'>
						Click any card to edit, drag to move between columns
					</p>
				</div>
				<button
					type='button'
					onClick={() => handleAddTask("todo")}
					className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
						aria-hidden='true'
					>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add task
				</button>
			</div>

			<div className='shrink-0'>
				<TaskFilters />
			</div>

			<div className='flex-1 overflow-hidden'>
				<TaskBoard
					filters={filters}
					onEdit={handleEdit}
					onAddTask={handleAddTask}
				/>
			</div>

			<TaskFormDialog
				open={formOpen}
				onClose={handleClose}
				task={editingTask}
				defaultStatus={defaultStatus}
			/>
		</div>
	)
}
