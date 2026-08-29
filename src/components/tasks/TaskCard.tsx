import { memo } from "react"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { Calendar, GripVertical, Trash2 } from "lucide-react"

import { formatDate } from "@/lib/utils"
import { TaskBadge } from "./TaskBadge"
import type { Task } from "@/types/task"

type TaskCardProps = {
	task: Task
} & (
	| { overlay: true }
	| {
			overlay?: false
			onEdit: (task: Task) => void
			onDelete: (id: string) => void
	  }
)

function TaskCardDescription({ description }: { description: string }) {
	if (!description) return null
	return (
		<p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
			{description}
		</p>
	)
}

function TaskCardDueDate({ dueDate }: { dueDate: string }) {
	if (!dueDate) return null
	return (
		<div className='flex items-center gap-1 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400'>
			<Calendar size={11} aria-hidden='true' />
			<span>{formatDate(dueDate)}</span>
		</div>
	)
}

function TaskCardOverlay({ task }: { task: Task }) {
	return (
		<div className='bg-white rounded-lg border border-gray-300 p-4 shadow-2xl rotate-2 cursor-grabbing'>
			<div className='flex items-start gap-2 mb-2'>
				<TaskBadge priority={task.priority} />
			</div>
			<h3 className='font-medium text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2'>
				{task.title}
			</h3>
			<TaskCardDescription description={task.description} />
		</div>
	)
}

function TaskCardItem({
	task,
	onEdit,
	onDelete,
}: {
	task: Task
	onEdit: (task: Task) => void
	onDelete: (id: string) => void
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				aria-hidden='true'
				className='h-25 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/40'
			/>
		)
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			role='listitem'
			className='group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all'
			onClick={() => onEdit(task)}
		>
			<div className='flex items-start justify-between gap-2 mb-2'>
				<TaskBadge priority={task.priority} />

				<div className='flex items-center gap-0.5 -mt-0.5 -mr-0.5 shrink-0'>
					<button
						type='button'
						ref={setActivatorNodeRef}
						aria-label={`Drag "${task.title}"`}
						className='p-0.5 text-gray-300 hover:text-gray-500 rounded xl:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-grab active:cursor-grabbing touch-none transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
						onClick={(e) => e.stopPropagation()}
						{...attributes}
						{...listeners}
					>
						<GripVertical size={14} aria-hidden='true' />
					</button>

					<button
						type='button'
						aria-label={`Delete "${task.title}"`}
						className='p-0.5 text-gray-400 hover:text-red-500 rounded xl:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1'
						onClick={(e) => {
							e.stopPropagation()
							onDelete(task.id)
						}}
					>
						<Trash2 size={14} aria-hidden='true' />
					</button>
				</div>
			</div>

			<h3 className='font-medium text-gray-900 text-sm leading-snug mb-1.5'>
				<button
					type='button'
					className='text-left w-full line-clamp-2 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-sm'
					onClick={(e) => {
						e.stopPropagation()
						onEdit(task)
					}}
				>
					{task.title}
				</button>
			</h3>

			<TaskCardDescription description={task.description} />
			<TaskCardDueDate dueDate={task.dueDate} />
		</div>
	)
}

const TaskCard = memo(function TaskCard(props: TaskCardProps) {
	if (props.overlay) {
		return <TaskCardOverlay task={props.task} />
	}
	return <TaskCardItem {...props} />
})

export { TaskCard }
