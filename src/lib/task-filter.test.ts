import { describe, expect, it } from "vitest"

import { filterTasks } from "./task-filter"
import { fixtureTasks } from "@/test/fixtures"

describe("filterTasks", () => {
  it("matches title and description search case-insensitively", () => {
    const byTitle = filterTasks(fixtureTasks, { q: "design system" })
    expect(byTitle.map((task) => task.id)).toEqual(["1"])

    const byDescription = filterTasks(fixtureTasks, { q: "handbook" })
    expect(byDescription.map((task) => task.id)).toEqual(["2"])

    const caseInsensitive = filterTasks(fixtureTasks, { q: "DESIGN" })
    expect(caseInsensitive.map((task) => task.id).sort()).toEqual(["1", "2"])
  })

  it("includes due-date boundary matches", () => {
    const filtered = filterTasks(fixtureTasks, {
      from: "2026-09-01",
      to: "2026-09-10",
    })
    const ids = filtered.map((task) => task.id).sort()

    expect(ids).toEqual(["1", "2", "3"])
    expect(ids).not.toContain("4")
    expect(ids).not.toContain("5")
  })

  it("combines task filters using AND logic", () => {
    const filtered = filterTasks(fixtureTasks, {
      q: "schema",
      status: "in_review",
      priority: "urgent",
      from: "2026-09-01",
      to: "2026-09-10",
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.id).toBe("3")
  })
})
