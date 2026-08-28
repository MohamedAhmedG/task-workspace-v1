import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'in_review', 'done'])
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long'),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().min(1, 'Due date is required'),
})

export const updateTaskSchema = createTaskSchema.partial()

export type TaskFormValues = z.infer<typeof createTaskSchema>
