import { Plus } from "lucide-react"
import { useState } from "react"

import { TaskFilters } from "@/components/tasks/TaskFilters"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"
import { TaskList } from "@/components/tasks/TaskList"
import { useTaskFilters } from "@/hooks/useTaskFilters"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import type { Task } from "@/types/task"

function ListPage() {
	const { filters, hasActiveFilters } = useTaskFilters()
	const { tasks, isLoading, isError } = useTasksQuery(filters)
	const [formOpen, setFormOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<Task | null>(null)

	const handleEdit = (task: Task) => {
		setEditingTask(task)
		setFormOpen(true)
	}

	const handleClose = () => {
		setFormOpen(false)
		setEditingTask(null)
	}

	return (
		<div className='h-full flex flex-col p-4 sm:p-6 gap-4 overflow-hidden'>
			<div className='flex items-center justify-between shrink-0'>
				<div>
					<h1 className='text-xl font-semibold text-gray-900'>List</h1>
					<p className='text-sm text-gray-500 mt-0.5'>
						{isLoading
							? "Loading…"
							: `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
					</p>
				</div>
				<button
					type='button'
					onClick={() => {
						setEditingTask(null)
						setFormOpen(true)
					}}
					className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors'
				>
					<Plus size={16} strokeWidth={2.5} aria-hidden='true' />
					Add task
				</button>
			</div>

			<div className='shrink-0'>
				<TaskFilters />
			</div>

			<TaskList
				tasks={tasks}
				isLoading={isLoading}
				isError={isError}
				hasActiveFilters={hasActiveFilters}
				onEdit={handleEdit}
			/>

			<TaskFormDialog
				open={formOpen}
				onClose={handleClose}
				task={editingTask}
			/>
		</div>
	)
}

export { ListPage }
