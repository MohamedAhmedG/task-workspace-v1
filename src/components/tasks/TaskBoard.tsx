import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	pointerWithin,
	rectIntersection,
	useSensor,
	useSensors,
	type CollisionDetection,
	type DragEndEvent,
	type DragStartEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useMemo, useState } from "react"

import { useTaskMutations } from "@/hooks/useTaskMutations"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import {
	TASK_STATUSES,
	isTaskStatus,
	type Task,
	type TaskFilters,
	type TaskStatus,
} from "@/types/task"
import { TaskCard } from "./TaskCard"
import { TaskColumn } from "./TaskColumn"
import { TaskDeleteDialog } from "./TaskDeleteDialog"
import { TaskBoardSkeleton, TaskError } from "./TaskState"

type TaskBoardProps = {
	filters?: TaskFilters
	onEdit: (task: Task) => void
	onAddTask: (status: TaskStatus) => void
}

function findTask(tasks: Task[], id: UniqueIdentifier) {
	return tasks.find((task) => task.id === String(id))
}

function statusFromDrop(overId: UniqueIdentifier, tasks: Task[]) {
	const id = String(overId)
	if (isTaskStatus(id)) return id
	return findTask(tasks, id)?.status
}

const detectCollision: CollisionDetection = (args) => {
	const pointerHits = pointerWithin(args)
	if (pointerHits.length > 0) return pointerHits

	const intersections = rectIntersection(args)
	if (intersections.length > 0) return intersections

	return closestCorners(args)
}

function TaskBoard({ filters, onEdit, onAddTask }: TaskBoardProps) {
	const { tasks, isLoading, isError } = useTasksQuery(filters)
	const { remove, update } = useTaskMutations()

	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const tasksByStatus = useMemo(() => {
		const groups = new Map<TaskStatus, Task[]>(
			TASK_STATUSES.map((status) => [status, []]),
		)
		for (const task of tasks) {
			groups.get(task.status)?.push(task)
		}
		return groups
	}, [tasks])

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragStart = ({ active }: DragStartEvent) => {
		setActiveTask(findTask(tasks, active.id) ?? null)
	}

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		setActiveTask(null)
		if (!over || active.id === over.id) return

		const dragged = findTask(tasks, active.id)
		if (!dragged) return

		const targetStatus = statusFromDrop(over.id, tasks)
		if (targetStatus && targetStatus !== dragged.status) {
			update.mutate({
				id: dragged.id,
				data: { status: targetStatus },
				silent: true,
			})
		}
	}

	if (isLoading) return <TaskBoardSkeleton />
	if (isError) return <TaskError className='h-64' />

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={detectCollision}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={() => setActiveTask(null)}
			>
				<div className='flex gap-4 h-full overflow-x-auto pb-2'>
					{TASK_STATUSES.map((status) => (
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
					{activeTask ? <TaskCard task={activeTask} overlay /> : null}
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

export { TaskBoard }
