import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useTaskFilters } from "../hooks/useTaskFilters"

export function TaskFilters() {
	const { filters, setFilter, clearFilters, hasActiveFilters } =
		useTaskFilters()

	return (
		<div
			role='search'
			aria-label='Filter tasks'
			className='flex items-center gap-2.5 flex-wrap'
		>
			<div className='relative flex-1 min-w-50 max-w-sm'>
				<Search
					size={15}
					className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
					aria-hidden='true'
				/>
				<Input
					type='search'
					placeholder='Search tasks…'
					value={filters.q}
					onChange={(e) => setFilter("q", e.target.value)}
					className='pl-9'
					aria-label='Search tasks'
				/>
			</div>

			<Select
				value={filters.status || "all"}
				onValueChange={(v) => setFilter("status", v === "all" ? "" : (v ?? ""))}
			>
				<SelectTrigger className='w-37' aria-label='Filter by status'>
					<SelectValue placeholder='All statuses' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All statuses</SelectItem>
					<SelectItem value='todo'>To Do</SelectItem>
					<SelectItem value='in_progress'>In Progress</SelectItem>
					<SelectItem value='done'>Done</SelectItem>
				</SelectContent>
			</Select>

			<Select
				value={filters.priority || "all"}
				onValueChange={(v) =>
					setFilter("priority", v === "all" ? "" : (v ?? ""))
				}
			>
				<SelectTrigger className='w-37' aria-label='Filter by priority'>
					<SelectValue placeholder='All priorities' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All priorities</SelectItem>
					<SelectItem value='low'>Low</SelectItem>
					<SelectItem value='medium'>Medium</SelectItem>
					<SelectItem value='high'>High</SelectItem>
				</SelectContent>
			</Select>

			{hasActiveFilters && (
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={clearFilters}
					className='text-gray-500 gap-1.5'
				>
					<X size={14} aria-hidden='true' />
					Clear
				</Button>
			)}
		</div>
	)
}
