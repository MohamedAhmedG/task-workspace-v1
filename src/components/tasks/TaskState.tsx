import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { TASK_STATUSES } from "@/types/task"

function TaskError({
	className,
	onRetry,
}: {
	className?: string
	onRetry: () => void
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3",
				className,
			)}
		>
			<p className='text-sm text-red-600'>Failed to load tasks.</p>
			<button
				type='button'
				onClick={onRetry}
				className='text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2'
			>
				Retry
			</button>
		</div>
	)
}

function TaskBoardSkeleton() {
	return (
		<div className='flex gap-4 h-full overflow-x-auto pb-2'>
			{TASK_STATUSES.map((col) => (
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

export { TaskBoardSkeleton, TaskError }
