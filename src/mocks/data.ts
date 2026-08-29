import type {
	Task,
	TaskPriority,
	TaskStatus,
} from "@/types/task"

const TITLES = [
	"Design system audit",
	"Set up CI/CD pipeline",
	"Write unit tests",
	"Migrate database schema",
	"Implement search endpoint",
	"Update API documentation",
	"Refactor component",
	"Fix pagination bug",
	"Performance profiling",
	"Add dark mode support",
	"Improve error messages",
	"Review pull request",
	"Update dependencies",
	"Implement rate limiting",
	"Add analytics tracking",
	"Optimize database queries",
	"Create onboarding flow",
	"Fix memory leak",
	"Add export feature",
	"Implement notifications",
]

const DESCRIPTIONS = [
	"Review all existing components for consistency and accessibility compliance.",
	"Configure automated workflows for testing and deployment.",
	"Achieve 80% test coverage for key modules.",
	"Update schema with new columns and optimized indexes.",
	"Full-text search using the existing database capabilities.",
	"Sync documentation with the latest API changes.",
	"Extract reusable components and improve maintainability.",
	"Reproduce and fix the edge case in data pagination.",
	"Use profiler tools to identify unnecessary re-renders.",
	"Implement system-preference-aware theming.",
]

const GEN_STATUSES: TaskStatus[] = ["todo", "in_progress", "in_review", "done"]
const GEN_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"]

function generateLargeTasks(count: number): Task[] {
	return Array.from({ length: count }, (_, i) => {
		const month = (i % 12) + 1
		const day = (i % 28) + 1
		const dateStr = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
		const createdAt = new Date(2026, month - 1, day).toISOString()
		return {
			id: `g${i}`,
			title: `${TITLES[i % TITLES.length]!} #${Math.floor(i / TITLES.length) + 1}`,
			description: DESCRIPTIONS[i % DESCRIPTIONS.length]!,
			status: GEN_STATUSES[i % 4]!,
			priority: GEN_PRIORITIES[Math.floor(i / 4) % 4]!,
			dueDate: dateStr,
			createdAt,
			updatedAt: createdAt,
		}
	})
}

export const largeSeedTasks = generateLargeTasks(1000)

export const seedTasks: Task[] = [
	{
		id: "1",
		title: "Design system audit",
		description:
			"Review all existing components for consistency and accessibility compliance.",
		status: "todo",
		priority: "high",
		dueDate: "2026-09-05",
		createdAt: "2026-08-20T09:00:00Z",
		updatedAt: "2026-08-20T09:00:00Z",
	},
	{
		id: "2",
		title: "Set up CI/CD pipeline",
		description:
			"Configure GitHub Actions for automated testing and deployment.",
		status: "todo",
		priority: "urgent",
		dueDate: "2026-09-01",
		createdAt: "2026-08-21T10:00:00Z",
		updatedAt: "2026-08-21T10:00:00Z",
	},
	{
		id: "3",
		title: "Write unit tests for auth module",
		description: "Achieve 80% coverage for authentication-related utilities.",
		status: "todo",
		priority: "medium",
		dueDate: "2026-09-10",
		createdAt: "2026-08-22T11:00:00Z",
		updatedAt: "2026-08-22T11:00:00Z",
	},
	{
		id: "4",
		title: "Migrate database schema",
		description: "Add soft-delete columns and update indexes for performance.",
		status: "in_progress",
		priority: "urgent",
		dueDate: "2026-08-31",
		createdAt: "2026-08-23T08:00:00Z",
		updatedAt: "2026-08-25T14:00:00Z",
	},
	{
		id: "5",
		title: "Implement search endpoint",
		description: "Full-text search across tasks using PostgreSQL tsvector.",
		status: "in_progress",
		priority: "high",
		dueDate: "2026-09-03",
		createdAt: "2026-08-24T09:00:00Z",
		updatedAt: "2026-08-26T10:00:00Z",
	},
	{
		id: "6",
		title: "Update API documentation",
		description: "Sync OpenAPI spec with latest endpoint changes.",
		status: "in_review",
		priority: "low",
		dueDate: "2026-09-12",
		createdAt: "2026-08-25T13:00:00Z",
		updatedAt: "2026-08-27T09:00:00Z",
	},
	{
		id: "7",
		title: "Refactor task card component",
		description: "Extract reusable badge and priority indicator components.",
		status: "in_review",
		priority: "medium",
		dueDate: "2026-09-08",
		createdAt: "2026-08-26T10:00:00Z",
		updatedAt: "2026-08-28T08:00:00Z",
	},
	{
		id: "8",
		title: "Fix pagination bug",
		description:
			"Last page shows incorrect item count when total is divisible by page size.",
		status: "in_review",
		priority: "high",
		dueDate: "2026-09-02",
		createdAt: "2026-08-18T09:00:00Z",
		updatedAt: "2026-08-19T16:00:00Z",
	},
	{
		id: "9",
		title: "Upgrade React to v19",
		description:
			"Follow the official migration guide and update all deprecated patterns.",
		status: "done",
		priority: "medium",
		dueDate: "2026-08-17",
		createdAt: "2026-08-15T10:00:00Z",
		updatedAt: "2026-08-17T15:00:00Z",
	},
	{
		id: "10",
		title: "Add dark mode support",
		description:
			"Implement system-preference-aware dark mode using CSS variables.",
		status: "done",
		priority: "low",
		dueDate: "2026-08-14",
		createdAt: "2026-08-10T11:00:00Z",
		updatedAt: "2026-08-14T12:00:00Z",
	},
	{
		id: "11",
		title: "Improve error boundary messages",
		description:
			"Replace generic fallback UI with context-aware recovery suggestions.",
		status: "done",
		priority: "low",
		dueDate: "2026-08-27",
		createdAt: "2026-08-27T08:00:00Z",
		updatedAt: "2026-08-27T08:00:00Z",
	},
	{
		id: "12",
		title: "Performance profiling",
		description:
			"Use React DevTools profiler to identify unnecessary re-renders on the board.",
		status: "done",
		priority: "medium",
		dueDate: "2026-08-13",
		createdAt: "2026-08-12T09:00:00Z",
		updatedAt: "2026-08-13T17:00:00Z",
	},
]
