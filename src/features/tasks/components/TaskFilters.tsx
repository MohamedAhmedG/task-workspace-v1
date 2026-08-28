import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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

	const [inputValue, setInputValue] = useState(filters.q ?? "")
	const [prevUrlQ, setPrevUrlQ] = useState(filters.q)

	const setFilterRef = useRef(setFilter)
	const filtersQRef = useRef(filters.q)
	useEffect(() => {
		setFilterRef.current = setFilter
		filtersQRef.current = filters.q
	})

	if (prevUrlQ !== filters.q) {
		setPrevUrlQ(filters.q)
		if (inputValue !== (filters.q ?? "")) {
			setInputValue(filters.q ?? "")
		}
	}

	useEffect(() => {
		const id = setTimeout(() => {
			const normalized = inputValue.trimEnd()
			if (inputValue !== normalized) {
				setInputValue(normalized)
			}
			if (normalized !== (filtersQRef.current ?? "")) {
				setFilterRef.current("q", normalized)
			}
		}, 300)
		return () => clearTimeout(id)
	}, [inputValue])

	const handleClearFilters = () => {
		setInputValue("")
		clearFilters()
	}

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
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
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
					<SelectItem value='in_review'>In Review</SelectItem>
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
					<SelectItem value='urgent'>Urgent</SelectItem>
				</SelectContent>
			</Select>

			<div className='flex items-center gap-1.5'>
				<label
					htmlFor='filter-from'
					className='text-xs text-gray-500 whitespace-nowrap'
				>
					From
				</label>
				<Input
					id='filter-from'
					type='date'
					value={filters.from}
					onChange={(e) => setFilter("from", e.target.value)}
					className='w-35'
				/>
			</div>

			<div className='flex items-center gap-1.5'>
				<label
					htmlFor='filter-to'
					className='text-xs text-gray-500 whitespace-nowrap'
				>
					To
				</label>
				<Input
					id='filter-to'
					type='date'
					value={filters.to}
					onChange={(e) => setFilter("to", e.target.value)}
					className='w-35'
				/>
			</div>

			{hasActiveFilters && (
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={handleClearFilters}
					className='text-gray-500 gap-1.5'
				>
					<X size={14} aria-hidden='true' />
					Clear
				</Button>
			)}
		</div>
	)
}
