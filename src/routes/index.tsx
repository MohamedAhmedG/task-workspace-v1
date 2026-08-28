import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { BoardPage } from '@/pages/BoardPage'
import { ListPage } from '@/pages/ListPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <BoardPage /> },
      { path: '/list', element: <ListPage /> },
    ],
  },
])
