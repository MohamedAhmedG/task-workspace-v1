import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"

import { BoardPage } from "@/pages/BoardPage"

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export function renderBoard(path = "/") {
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter([{ path: "/", element: <BoardPage /> }], {
    initialEntries: [path],
  })

  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>,
  )

  return { ...view, router, queryClient }
}
