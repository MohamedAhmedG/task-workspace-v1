import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PageFallback } from '@/components/PageFallback'

const BoardPage = lazy(() =>
  import('@/pages/BoardPage').then((m) => ({ default: m.BoardPage }))
)
const ListPage = lazy(() =>
  import('@/pages/ListPage').then((m) => ({ default: m.ListPage }))
)

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageFallback />}>
            <BoardPage />
          </Suspense>
        ),
      },
      {
        path: '/list',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ListPage />
          </Suspense>
        ),
      },
    ],
  },
])
