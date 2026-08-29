import { Link, useLocation } from "react-router-dom"
import { navLinks } from "@/routes/paths"

export function Header() {
	const { pathname, search } = useLocation()

	return (
		<header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
			<div className='px-4 sm:px-6 h-14 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='text-blue-600'
						aria-hidden='true'
					>
						<rect width='7' height='7' x='3' y='3' rx='1' />
						<rect width='7' height='7' x='14' y='3' rx='1' />
						<rect width='7' height='7' x='14' y='14' rx='1' />
						<rect width='7' height='7' x='3' y='14' rx='1' />
					</svg>
					<span className='font-semibold text-gray-900'>TaskFlow</span>
				</div>

				<nav
					aria-label='View toggle'
					className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'
				>
					{navLinks.map((link) => {
						const isActive = pathname === link.to
						return (
							<Link
								key={link.to}
								to={{ pathname: link.to, search }}
								aria-current={isActive ? "page" : undefined}
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
									isActive
										? "bg-white shadow-sm text-gray-900"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								{link.label}
							</Link>
						)
					})}
				</nav>
			</div>
		</header>
	)
}
