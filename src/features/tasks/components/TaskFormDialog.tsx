import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createTaskSchema, type TaskFormValues } from "@/schemas/task"
import { useTaskMutations } from "@/hooks/useTaskMutations"
import type { Task, TaskStatus } from "@/types/task"

interface TaskFormDialogProps {
	open: boolean
	onClose: () => void
	task?: Task | null
	defaultStatus?: TaskStatus
}

export function TaskFormDialog({
	open,
	onClose,
	task,
	defaultStatus = "todo",
}: TaskFormDialogProps) {
	const { create, update } = useTaskMutations()
	const isEditing = !!task

	const form = useForm<TaskFormValues>({
		resolver: zodResolver(createTaskSchema),
		values: {
			title: task?.title ?? "",
			description: task?.description ?? "",
			status: task?.status ?? defaultStatus,
			priority: task?.priority ?? "medium",
			dueDate: task?.dueDate ?? "",
		},
	})

	const onSubmit = (values: TaskFormValues) => {
		if (isEditing) {
			update.mutate({ id: task.id, data: values }, { onSuccess: onClose })
		} else {
			create.mutate(values, { onSuccess: onClose })
		}
	}

	const isPending = create.isPending || update.isPending

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) onClose()
			}}
			title={isEditing ? "Edit task" : "New task"}
			className='sm:max-w-120'
			footer={
				<>
					<Button
						type='button'
						variant='outline'
						onClick={onClose}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button type='submit' form='task-form' disabled={isPending}>
						{isPending
							? "Saving…"
							: isEditing
								? "Save changes"
								: "Create task"}
					</Button>
				</>
			}
		>
			<form
				id='task-form'
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-4'
				noValidate
			>
				<div className='space-y-1.5'>
					<Label htmlFor='task-title'>
						Title{" "}
						<span className='text-red-500' aria-hidden='true'>
							*
						</span>
					</Label>
					<Input
						id='task-title'
						placeholder='Task title'
						aria-invalid={!!form.formState.errors.title}
						aria-describedby={
							form.formState.errors.title ? "title-error" : undefined
						}
						{...form.register("title")}
					/>
					{form.formState.errors.title && (
						<p id='title-error' className='text-xs text-red-500' role='alert'>
							{form.formState.errors.title.message}
						</p>
					)}
				</div>

				<div className='space-y-1.5'>
					<Label htmlFor='task-description'>Description</Label>
					<Textarea
						id='task-description'
						placeholder='Optional description'
						rows={3}
						className='resize-none'
						aria-invalid={!!form.formState.errors.description}
						aria-describedby={
							form.formState.errors.description
								? "description-error"
								: undefined
						}
						{...form.register("description")}
					/>
					{form.formState.errors.description && (
						<p
							id='description-error'
							className='text-xs text-red-500'
							role='alert'
						>
							{form.formState.errors.description.message}
						</p>
					)}
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-1.5'>
						<Label htmlFor='task-status'>Status</Label>
						<Controller
							name='status'
							control={form.control}
							render={({ field }) => (
								<Select
									id='task-status'
									value={field.value}
									onValueChange={field.onChange}
									className='w-full'
									items={[
										{ value: "todo", label: "To Do" },
										{ value: "in_progress", label: "In Progress" },
										{ value: "in_review", label: "In Review" },
										{ value: "done", label: "Done" },
									]}
								/>
							)}
						/>
					</div>

					<div className='space-y-1.5'>
						<Label htmlFor='task-priority'>Priority</Label>
						<Controller
							name='priority'
							control={form.control}
							render={({ field }) => (
								<Select
									id='task-priority'
									value={field.value}
									onValueChange={field.onChange}
									className='w-full'
									items={[
										{ value: "low", label: "Low" },
										{ value: "medium", label: "Medium" },
										{ value: "high", label: "High" },
										{ value: "urgent", label: "Urgent" },
									]}
								/>
							)}
						/>
					</div>
				</div>

				<div className='space-y-1.5'>
					<Label htmlFor='task-due-date'>
						Due Date{" "}
						<span className='text-red-500' aria-hidden='true'>
							*
						</span>
					</Label>
					<Input
						id='task-due-date'
						type='date'
						aria-invalid={!!form.formState.errors.dueDate}
						aria-describedby={
							form.formState.errors.dueDate ? "due-date-error" : undefined
						}
						{...form.register("dueDate")}
					/>
					{form.formState.errors.dueDate && (
						<p
							id='due-date-error'
							className='text-xs text-red-500'
							role='alert'
						>
							{form.formState.errors.dueDate.message}
						</p>
					)}
				</div>
			</form>
		</Dialog>
	)
}
