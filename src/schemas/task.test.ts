import { describe, expect, it } from "vitest"

import { createTaskSchema } from "./task"
import { validTaskInput } from "@/test/fixtures"

describe("createTaskSchema", () => {
  it("accepts the current task domain values", () => {
    const result = createTaskSchema.safeParse(validTaskInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe("in_review")
      expect(result.data.priority).toBe("urgent")
    }
  })

  it("rejects an empty or overly long title", () => {
    expect(
      createTaskSchema.safeParse({ ...validTaskInput, title: "" }).success,
    ).toBe(false)
    expect(
      createTaskSchema.safeParse({
        ...validTaskInput,
        title: "a".repeat(101),
      }).success,
    ).toBe(false)
  })

  it("requires a due date", () => {
    const { dueDate: _dueDate, ...withoutDueDate } = validTaskInput

    expect(createTaskSchema.safeParse(withoutDueDate).success).toBe(false)
  })
})
