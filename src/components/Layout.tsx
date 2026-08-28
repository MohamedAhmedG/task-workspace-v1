import { Link, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
              aria-hidden="true"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span className="font-semibold text-gray-900">TaskFlow</span>
          </div>

          <nav aria-label="View toggle" className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Link
              to="/"
              aria-current={pathname === '/' ? 'page' : undefined}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === '/'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Board
            </Link>
            <Link
              to="/list"
              aria-current={pathname === '/list' ? 'page' : undefined}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === '/list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
