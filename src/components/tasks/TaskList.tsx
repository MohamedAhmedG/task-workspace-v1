import { useVirtualizer } from "@tanstack/react-virtual"
import {
	ChevronDown,
	ChevronUp,
	ChevronsUpDown,
	Pencil,
	Trash2,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import type { TaskFilters } from "@/hooks/useTasksQuery"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import {
	TASK_LIST_ROW_GRID,
	TASK_LIST_ROW_HEIGHT,
	TASK_SORT_COLUMNS,
} from "@/lib/task-list"
import { formatDate } from "@/lib/utils"
import {
	TASK_PRIORITY_ORDER,
	TASK_STATUS_ORDER,
	type Task,
	type TaskSortDir,
	type TaskSortField,
} from "@/types/task"
import { TaskBadge } from "./TaskBadge"
import { TaskDeleteDialog } from "./TaskDeleteDialog"
import { TaskError } from "./TaskState"

type TaskListProps = {
	filters?: TaskFilters
	onEdit: (task: Task) => void
}

function sortTasks(
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

function SortIndicator({
	field,
	active,
	dir,
}: {
	field: TaskSortField
	active: TaskSortField
	dir: TaskSortDir
}) {
	if (field !== active) {
		return (
			<ChevronsUpDown
				size={13}
				className='text-gray-400 shrink-0'
				aria-hidden='true'
			/>
		)
	}
	const Icon = dir === "asc" ? ChevronUp : ChevronDown
	return (
		<Icon size={13} className='text-gray-700 shrink-0' aria-hidden='true' />
	)
}

function SortHeader({
	field,
	label,
	active,
	dir,
	onSort,
}: {
	field: TaskSortField
	label: string
	active: TaskSortField
	dir: TaskSortDir
	onSort: (field: TaskSortField) => void
}) {
	return (
		<div
			role='columnheader'
			aria-sort={
				field === active ? (dir === "asc" ? "ascending" : "descending") : "none"
			}
		>
			<button
				type='button'
				className='flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide select-none cursor-pointer hover:text-gray-800 transition-colors'
				onClick={() => onSort(field)}
			>
				{label}
				<SortIndicator field={field} active={active} dir={dir} />
			</button>
		</div>
	)
}

function ListSkeleton() {
	return (
		<div className='flex-1 overflow-y-auto divide-y divide-gray-50'>
			{Array.from({ length: 8 }, (_, i) => (
				<div key={i} className={`${TASK_LIST_ROW_GRID} py-4 items-center`}>
					<Skeleton className='h-4 w-2/3' />
					<Skeleton className='h-5 w-20 rounded-full' />
					<Skeleton className='h-5 w-14 rounded-full' />
					<Skeleton className='h-4 w-16' />
					<Skeleton className='h-4 w-16' />
					<div className='flex gap-1'>
						<Skeleton className='h-6 w-6 rounded' />
						<Skeleton className='h-6 w-6 rounded' />
					</div>
				</div>
			))}
		</div>
	)
}

function ListEmpty({ hasActiveFilters }: { hasActiveFilters: boolean }) {
	return (
		<div className='flex-1 flex flex-col items-center justify-center gap-2 text-center py-16'>
			<p className='text-sm font-medium text-gray-600'>No tasks found</p>
			<p className='text-xs text-gray-400'>
				{hasActiveFilters
					? "Try adjusting your filters"
					: "Create your first task to get started"}
			</p>
		</div>
	)
}

function ListRow({
	task,
	index,
	start,
	onEdit,
	onDelete,
	measureRef,
}: {
	task: Task
	index: number
	start: number
	onEdit: (task: Task) => void
	onDelete: (id: string) => void
	measureRef: (node: HTMLDivElement | null) => void
}) {
	return (
		<div
			role='listitem'
			data-index={index}
			ref={measureRef}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: `${TASK_LIST_ROW_HEIGHT}px`,
				transform: `translateY(${start}px)`,
			}}
			className={`${TASK_LIST_ROW_GRID} items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors group`}
		>
			<button
				type='button'
				className='text-left text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors py-4'
				onClick={() => onEdit(task)}
			>
				{task.title}
			</button>
			<TaskBadge status={task.status} />
			<TaskBadge priority={task.priority} />
			<span className='text-xs text-gray-500'>
				{task.dueDate ? formatDate(task.dueDate) : "—"}
			</span>
			<span className='text-xs text-gray-400'>
				{new Date(task.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				})}
			</span>
			<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'>
				<button
					type='button'
					aria-label={`Edit "${task.title}"`}
					className='p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors'
					onClick={() => onEdit(task)}
				>
					<Pencil size={13} aria-hidden='true' />
				</button>
				<button
					type='button'
					aria-label={`Delete "${task.title}"`}
					className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
					onClick={() => onDelete(task.id)}
				>
					<Trash2 size={13} aria-hidden='true' />
				</button>
			</div>
		</div>
	)
}

function TaskList({ filters = {}, onEdit }: TaskListProps) {
	const { tasks, isLoading, isError } = useTasksQuery(filters)
	const { remove } = useTaskMutations()
	const { q = "", status = "", priority = "", from = "", to = "" } = filters
	const hasActiveFilters = !!(q || status || priority || from || to)

	const [sortField, setSortField] = useState<TaskSortField>("createdAt")
	const [sortDir, setSortDir] = useState<TaskSortDir>("desc")
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const sortedTasks = useMemo(
		() => sortTasks(tasks, sortField, sortDir),
		[tasks, sortField, sortDir],
	)

	const parentRef = useRef<HTMLDivElement>(null)
	const virtualizer = useVirtualizer({
		count: sortedTasks.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => TASK_LIST_ROW_HEIGHT,
		overscan: 8,
	})

	const handleSort = (field: TaskSortField) => {
		if (sortField === field) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"))
		} else {
			setSortField(field)
			setSortDir("asc")
		}
	}

	return (
		<>
			<div className='flex-1 overflow-hidden min-h-0'>
				<div className='h-full overflow-x-auto'>
					<div className='flex flex-col bg-white rounded-xl border border-gray-200 h-full min-w-180'>
						<div
							className={`${TASK_LIST_ROW_GRID} py-3 border-b border-gray-100 shrink-0 bg-gray-50 rounded-t-xl`}
						>
							{TASK_SORT_COLUMNS.map((column) => (
								<SortHeader
									key={column.field}
									field={column.field}
									label={column.label}
									active={sortField}
									dir={sortDir}
									onSort={handleSort}
								/>
							))}
							<div role='columnheader'>
								<span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
									Actions
								</span>
							</div>
						</div>

						{isLoading ? (
							<ListSkeleton />
						) : isError ? (
							<TaskError className='flex-1' />
						) : sortedTasks.length === 0 ? (
							<ListEmpty hasActiveFilters={hasActiveFilters} />
						) : (
							<div
								ref={parentRef}
								className='flex-1 overflow-y-auto'
								role='list'
								aria-label='Task list'
							>
								<div
									style={{ height: `${virtualizer.getTotalSize()}px` }}
									className='relative'
								>
									{virtualizer.getVirtualItems().map((virtualRow) => {
										const task = sortedTasks[virtualRow.index]!
										return (
											<ListRow
												key={task.id}
												task={task}
												index={virtualRow.index}
												start={virtualRow.start}
												onEdit={onEdit}
												onDelete={setDeletingId}
												measureRef={virtualizer.measureElement}
											/>
										)
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

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

export { TaskList }
