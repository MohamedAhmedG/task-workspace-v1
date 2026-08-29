import { z } from "zod"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/types/task"

const taskStatusSchema = z.enum(TASK_STATUSES)
const taskPrioritySchema = z.enum(TASK_PRIORITIES)

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long"),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().min(1, "Due date is required"),
})

export const updateTaskSchema = createTaskSchema.partial()

export type TaskFormValues = z.infer<typeof createTaskSchema>
