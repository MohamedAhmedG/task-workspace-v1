import { createBrowserRouter } from 'react-router-dom'
import { BoardPage } from '@/pages/BoardPage'
import { ListPage } from '@/pages/ListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BoardPage />,
  },
  {
    path: '/list',
    element: <ListPage />,
  },
])
