export const ROUTES = {
  board: '/',
  list: '/list',
} as const

export const navLinks = [
  { to: ROUTES.board, label: 'Board' },
  { to: ROUTES.list, label: 'List' },
] as const
