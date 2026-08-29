import { delay, http, HttpResponse } from "msw"
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { renderBoard } from "./render"
import { server } from "./server"

async function chooseOption(label: string, optionName: string) {
  const user = userEvent.setup()
  await user.click(screen.getByLabelText(label))
  await user.click(await screen.findByRole("option", { name: optionName }))
}

describe("task workflows", () => {
  it("creates a task through the form and shows it on the board", async () => {
    const user = userEvent.setup()
    renderBoard()

    await screen.findByRole("button", { name: "Design system audit" })
    await user.click(screen.getByRole("button", { name: "Add task" }))

    await screen.findByRole("heading", { name: "New task" })
    await user.type(screen.getByLabelText(/title/i), "Ship review notes")
    await user.type(
      screen.getByLabelText(/description/i),
      "Ready for stakeholders",
    )
    await chooseOption("Status", "In Review")
    await chooseOption("Priority", "Urgent")
    await user.type(screen.getByLabelText(/due date/i), "2026-09-15")
    await user.click(screen.getByRole("button", { name: "Create task" }))

    expect(
      await screen.findByRole("button", { name: "Ship review notes" }),
    ).toBeInTheDocument()
  })

  it("keeps a task after canceling delete and removes it after confirm", async () => {
    const user = userEvent.setup()
    renderBoard()

    const title = await screen.findByRole("button", {
      name: "Fix pagination bug",
    })
    await user.click(
      screen.getByRole("button", { name: 'Delete "Fix pagination bug"' }),
    )

    const dialog = await screen.findByRole("alertdialog")
    expect(within(dialog).getByText("Delete task?")).toBeInTheDocument()
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }))

    expect(
      await screen.findByRole("button", { name: "Fix pagination bug" }),
    ).toBeInTheDocument()
    expect(title).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: 'Delete "Fix pagination bug"' }),
    )
    const confirmDialog = await screen.findByRole("alertdialog")
    await user.click(within(confirmDialog).getByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Fix pagination bug" }),
      ).not.toBeInTheDocument()
    })
  })

  it("restores the previous task when an optimistic edit fails", async () => {
    const user = userEvent.setup()
    server.use(
      http.patch("/api/tasks/:id", async () => {
        await delay(120)
        return HttpResponse.json({ error: "Simulated error" }, { status: 500 })
      }),
    )
    renderBoard()

    await user.click(await screen.findByRole("button", { name: "Original" }))
    await screen.findByRole("heading", { name: "Edit task" })

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, "Updated")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      await screen.findByRole("button", { name: "Updated", hidden: true }),
    ).toBeInTheDocument()

    expect(
      await screen.findByRole("button", { name: "Original", hidden: true }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Updated", hidden: true }),
    ).not.toBeInTheDocument()
    expect(await screen.findByText("Failed to update task")).toBeInTheDocument()
  })

  it("updates search immediately, debounces the URL, and trims trailing spaces", async () => {
    const { router } = renderBoard()
    await screen.findByRole("button", { name: "Design system audit" })

    const input = screen.getByLabelText("Search tasks")
    vi.useFakeTimers()

    fireEvent.change(input, { target: { value: "design   " } })
    expect(input).toHaveValue("design   ")
    expect(router.state.location.search).not.toContain("q=")
    expect(
      screen.getByRole("button", { name: "Fix pagination bug" }),
    ).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(input).toHaveValue("design")
    expect(router.state.location.search).toContain("q=design")

    vi.useRealTimers()
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Fix pagination bug" }),
      ).not.toBeInTheDocument()
    })

    vi.useFakeTimers()
    fireEvent.change(input, { target: { value: "design system" } })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(input).toHaveValue("design system")
    expect(new URLSearchParams(router.state.location.search).get("q")).toBe(
      "design system",
    )

    vi.useRealTimers()
    await act(async () => {
      await router.navigate("/?q=audit")
    })
    expect(input).toHaveValue("audit")
  })
})
