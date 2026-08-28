import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'

const BoardPage = lazy(() =>
  import('@/pages/BoardPage').then((m) => ({ default: m.BoardPage }))
)
const ListPage = lazy(() =>
  import('@/pages/ListPage').then((m) => ({ default: m.ListPage }))
)

function PageFallback() {
  return (
    <div className="h-full flex items-center justify-center">
      <svg
        className="animate-spin text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}

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
