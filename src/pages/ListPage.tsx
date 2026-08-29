import { useVirtualizer } from "@tanstack/react-virtual"
import {
	ChevronDown,
	ChevronUp,
	ChevronsUpDown,
	Pencil,
	Trash2,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskDeleteDialog } from "@/features/tasks/components/TaskDeleteDialog"
import { TaskFilters } from "@/features/tasks/components/TaskFilters"
import { TaskFormDialog } from "@/features/tasks/components/TaskFormDialog"
import { useTaskFilters } from "@/features/tasks/hooks/useTaskFilters"
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations"
import { useTasksQuery } from "@/features/tasks/hooks/useTasksQuery"
import type { Task } from "@/features/tasks/types/task"

type SortField = "title" | "status" | "priority" | "dueDate" | "createdAt"
type SortDir = "asc" | "desc"

const PRIORITY_ORDER: Record<Task["priority"], number> = {
	urgent: 0,
	high: 1,
	medium: 2,
	low: 3,
}
const STATUS_ORDER: Record<Task["status"], number> = {
	todo: 0,
	in_progress: 1,
	in_review: 2,
	done: 3,
}

function sortTasks(tasks: Task[], field: SortField, dir: SortDir): Task[] {
	return [...tasks].sort((a, b) => {
		let cmp = 0
		switch (field) {
			case "title":
				cmp = a.title.localeCompare(b.title)
				break
			case "priority":
				cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
				break
			case "status":
				cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
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

const STATUS_STYLES: Record<Task["status"], string> = {
	todo: "bg-slate-100 text-slate-600",
	in_progress: "bg-blue-100 text-blue-700",
	in_review: "bg-yellow-100 text-yellow-700",
	done: "bg-emerald-100 text-emerald-700",
}
const STATUS_LABELS: Record<Task["status"], string> = {
	todo: "To Do",
	in_progress: "In Progress",
	in_review: "In Review",
	done: "Done",
}
const PRIORITY_STYLES: Record<Task["priority"], string> = {
	urgent: "bg-red-600 text-white",
	high: "bg-red-100 text-red-700",
	medium: "bg-amber-100 text-amber-700",
	low: "bg-emerald-100 text-emerald-700",
}

function SortHeader({
	field,
	active,
	dir,
	className,
	onClick,
	children,
}: {
	field: SortField
	active: SortField
	dir: SortDir
	className: string
	onClick: () => void
	children: string
}) {
	return (
		<div
			role='columnheader'
			aria-sort={
				field === active ? (dir === "asc" ? "ascending" : "descending") : "none"
			}
		>
			<button type='button' className={className} onClick={onClick}>
				{children}
				<SortIndicator field={field} active={active} dir={dir} />
			</button>
		</div>
	)
}

function SortIndicator({
	field,
	active,
	dir,
}: {
	field: SortField
	active: SortField
	dir: SortDir
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
	return dir === "asc" ? (
		<ChevronUp
			size={13}
			className='text-gray-700 shrink-0'
			aria-hidden='true'
		/>
	) : (
		<ChevronDown
			size={13}
			className='text-gray-700 shrink-0'
			aria-hidden='true'
		/>
	)
}

const ROW_HEIGHT = 60

export function ListPage() {
	const { filters, hasActiveFilters } = useTaskFilters()
	const { tasks, isLoading, isError, refetch } = useTasksQuery(filters)
	const { remove } = useTaskMutations()

	const [sortField, setSortField] = useState<SortField>("createdAt")
	const [sortDir, setSortDir] = useState<SortDir>("desc")
	const [formOpen, setFormOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<Task | null>(null)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const sortedTasks = useMemo(
		() => sortTasks(tasks, sortField, sortDir),
		[tasks, sortField, sortDir],
	)

	const parentRef = useRef<HTMLDivElement>(null)
	const virtualizer = useVirtualizer({
		count: sortedTasks.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 8,
	})

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"))
		} else {
			setSortField(field)
			setSortDir("asc")
		}
	}

	const handleEdit = (task: Task) => {
		setEditingTask(task)
		setFormOpen(true)
	}

	const handleClose = () => {
		setFormOpen(false)
		setEditingTask(null)
	}

	const colClass =
		"flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide select-none cursor-pointer hover:text-gray-800 transition-colors"

	return (
		<div className='h-full flex flex-col p-4 sm:p-6 gap-4 overflow-hidden'>
			<div className='flex items-center justify-between shrink-0'>
				<div>
					<h1 className='text-xl font-semibold text-gray-900'>List</h1>
					<p className='text-sm text-gray-500 mt-0.5'>
						{isLoading
							? "Loading…"
							: `${sortedTasks.length} task${sortedTasks.length !== 1 ? "s" : ""}`}
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

			<div className='flex-1 overflow-hidden min-h-0'>
				<div className='h-full overflow-x-auto'>
					<div className='flex flex-col bg-white rounded-xl border border-gray-200 h-full min-w-180'>
						<div className='grid grid-cols-[1fr_128px_112px_112px_112px_80px] gap-4 px-4 py-3 border-b border-gray-100 shrink-0 bg-gray-50 rounded-t-xl'>
							<SortHeader
								field='title'
								active={sortField}
								dir={sortDir}
								className={colClass}
								onClick={() => handleSort("title")}
							>
								Task
							</SortHeader>
							<SortHeader
								field='status'
								active={sortField}
								dir={sortDir}
								className={colClass}
								onClick={() => handleSort("status")}
							>
								Status
							</SortHeader>
							<SortHeader
								field='priority'
								active={sortField}
								dir={sortDir}
								className={colClass}
								onClick={() => handleSort("priority")}
							>
								Priority
							</SortHeader>
							<SortHeader
								field='dueDate'
								active={sortField}
								dir={sortDir}
								className={colClass}
								onClick={() => handleSort("dueDate")}
							>
								Due Date
							</SortHeader>
							<SortHeader
								field='createdAt'
								active={sortField}
								dir={sortDir}
								className={colClass}
								onClick={() => handleSort("createdAt")}
							>
								Created
							</SortHeader>
							<div role='columnheader'>
								<span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
									Actions
								</span>
							</div>
						</div>

						{isLoading ? (
							<div className='flex-1 overflow-y-auto divide-y divide-gray-50'>
								{Array.from({ length: 8 }, (_, i) => (
									<div
										key={i}
										className='grid grid-cols-[1fr_128px_112px_112px_112px_80px] gap-4 px-4 py-4 items-center'
									>
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
						) : isError ? (
							<div className='flex-1 flex flex-col items-center justify-center gap-3'>
								<p className='text-sm text-red-600'>Failed to load tasks.</p>
								<button
									type='button'
									onClick={() => refetch()}
									className='text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2'
								>
									Retry
								</button>
							</div>
						) : sortedTasks.length === 0 ? (
							<div className='flex-1 flex flex-col items-center justify-center gap-2 text-center py-16'>
								<p className='text-sm font-medium text-gray-600'>
									No tasks found
								</p>
								<p className='text-xs text-gray-400'>
									{hasActiveFilters
										? "Try adjusting your filters"
										: "Create your first task to get started"}
								</p>
							</div>
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
											<div
												key={task.id}
												role='listitem'
												data-index={virtualRow.index}
												ref={virtualizer.measureElement}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: `${ROW_HEIGHT}px`,
													transform: `translateY(${virtualRow.start}px)`,
												}}
												className='grid grid-cols-[1fr_128px_112px_112px_112px_80px] gap-4 px-4 items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors group'
											>
												<button
													type='button'
													className='text-left text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors py-4'
													onClick={() => handleEdit(task)}
												>
													{task.title}
												</button>
												<span
													className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full w-fit ${STATUS_STYLES[task.status]}`}
												>
													{STATUS_LABELS[task.status]}
												</span>
												<span
													className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full w-fit ${PRIORITY_STYLES[task.priority]}`}
												>
													{task.priority.charAt(0).toUpperCase() +
														task.priority.slice(1)}
												</span>
												<span className='text-xs text-gray-500'>
													{task.dueDate ? formatDate(task.dueDate) : "—"}
												</span>
												<span className='text-xs text-gray-400'>
													{new Date(task.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
														},
													)}
												</span>
												<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity'>
													<button
														type='button'
														aria-label={`Edit "${task.title}"`}
														className='p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors'
														onClick={() => handleEdit(task)}
													>
														<Pencil size={13} aria-hidden='true' />
													</button>
													<button
														type='button'
														aria-label={`Delete "${task.title}"`}
														className='p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
														onClick={() => setDeletingId(task.id)}
													>
														<Trash2 size={13} aria-hidden='true' />
													</button>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<TaskFormDialog
				open={formOpen}
				onClose={handleClose}
				task={editingTask}
			/>

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
		</div>
	)
}
