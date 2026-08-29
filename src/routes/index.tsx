import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PageFallback } from './PageFallback'
import { RouteError } from './RouteError'
import { ROUTES } from './paths'

const BoardPage = lazy(() =>
  import('@/pages/BoardPage').then((m) => ({ default: m.BoardPage }))
)
const ListPage = lazy(() =>
  import('@/pages/ListPage').then((m) => ({ default: m.ListPage }))
)

export { ROUTES, navLinks } from './paths'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        path: ROUTES.board,
        element: (
          <Suspense fallback={<PageFallback />}>
            <BoardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.list,
        element: (
          <Suspense fallback={<PageFallback />}>
            <ListPage />
          </Suspense>
        ),
      },
    ],
  },
])
