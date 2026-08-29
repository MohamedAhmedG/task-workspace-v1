import { describe, expect, it } from "vitest"

import { sortTasks } from "./task-list"
import { fixtureTasks } from "@/test/fixtures"

describe("sortTasks", () => {
  it("orders priority by urgency in both directions", () => {
    const asc = sortTasks(fixtureTasks, "priority", "asc").map(
      (task) => task.priority,
    )
    const desc = sortTasks(fixtureTasks, "priority", "desc").map(
      (task) => task.priority,
    )

    expect(asc).toEqual(["urgent", "urgent", "high", "medium", "low"])
    expect(desc).toEqual(["low", "medium", "high", "urgent", "urgent"])
  })

  it("orders status by workflow and due dates chronologically", () => {
    const byStatus = sortTasks(fixtureTasks, "status", "asc").map(
      (task) => task.status,
    )
    expect(byStatus).toEqual([
      "todo",
      "todo",
      "in_progress",
      "in_review",
      "done",
    ])

    const byDueDate = sortTasks(fixtureTasks, "dueDate", "asc").map(
      (task) => task.dueDate,
    )
    expect(byDueDate).toEqual([
      "2026-08-20",
      "2026-09-01",
      "2026-09-05",
      "2026-09-10",
      "2026-09-15",
    ])
  })
})
