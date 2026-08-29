import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Task, TaskStatus } from "../types/task"
import type { TaskFilters } from "../hooks/useTasksQuery"
import { useTasksQuery } from "../hooks/useTasksQuery"
import { useTaskMutations } from "../hooks/useTaskMutations"
import { TaskCardOverlay } from "./TaskCard"
import { TaskColumn } from "./TaskColumn"
import { TaskDeleteDialog } from "./TaskDeleteDialog"

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "in_review", "done"]
const VALID_STATUSES = new Set<string>(COLUMNS)

interface TaskBoardProps {
	filters?: TaskFilters
	onEdit: (task: Task) => void
	onAddTask: (status: TaskStatus) => void
}

export function TaskBoard({ filters, onEdit, onAddTask }: TaskBoardProps) {
	const { tasks, isLoading, isError, refetch } = useTasksQuery(filters)
	const { remove, update } = useTaskMutations()
	const queryClient = useQueryClient()

	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const tasksByStatus = useMemo(() => {
		const groups = new Map<TaskStatus, Task[]>(COLUMNS.map((s) => [s, []]))
		for (const task of tasks) {
			groups.get(task.status)?.push(task)
		}
		return groups
	}, [tasks])

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	)

	const handleDragStart = ({ active }: DragStartEvent) => {
		const allCached = queryClient.getQueryData<Task[]>(["tasks"]) ?? []
		setActiveTask(allCached.find((t) => t.id === active.id) ?? null)
	}

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		setActiveTask(null)
		if (!over || active.id === over.id) return

		const allCached = queryClient.getQueryData<Task[]>(["tasks"]) ?? []
		const dragged = allCached.find((t) => t.id === active.id)
		if (!dragged) return

		const targetStatus: TaskStatus = VALID_STATUSES.has(String(over.id))
			? (over.id as TaskStatus)
			: (allCached.find((t) => t.id === over.id)?.status ?? dragged.status)

		if (targetStatus !== dragged.status) {
			update.mutate({ id: dragged.id, data: { status: targetStatus } })
		}
	}

	if (isLoading) {
		return (
			<div className='flex gap-4 h-full overflow-x-auto pb-2'>
				{COLUMNS.map((col) => (
					<div
						key={col}
						className='shrink-0 w-75 flex flex-col bg-gray-50 rounded-xl border border-gray-200'
					>
						<div className='px-4 py-3 flex items-center gap-2'>
							<Skeleton className='w-2 h-2 rounded-full' />
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-4 w-6 rounded-full ml-1' />
						</div>
						<div className='p-3 space-y-2.5'>
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className='bg-white rounded-lg border border-gray-200 p-4 space-y-2'
								>
									<Skeleton className='h-5 w-14 rounded-full' />
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-3 w-3/4' />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex flex-col items-center justify-center h-64 gap-3'>
				<p className='text-sm text-red-600'>Failed to load tasks.</p>
				<button
					type='button'
					onClick={() => refetch()}
					className='text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2'
				>
					Retry
				</button>
			</div>
		)
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={() => setActiveTask(null)}
			>
				<div className='flex gap-4 h-full overflow-x-auto pb-2'>
					{COLUMNS.map((status) => (
						<TaskColumn
							key={status}
							status={status}
							tasks={tasksByStatus.get(status) ?? []}
							onEdit={onEdit}
							onDelete={setDeletingId}
							onAddTask={onAddTask}
						/>
					))}
				</div>

				<DragOverlay dropAnimation={null}>
					{activeTask ? <TaskCardOverlay task={activeTask} /> : null}
				</DragOverlay>
			</DndContext>

			<TaskDeleteDialog
				open={deletingId !== null}
				onOpenChange={(open) => {
					if (!open) setDeletingId(null)
				}}
				onConfirm={() => {
					if (deletingId) {
						remove.mutate(deletingId)
						setDeletingId(null)
					}
				}}
			/>
		</>
	)
}
