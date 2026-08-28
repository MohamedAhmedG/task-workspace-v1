import { Component, type ReactNode } from "react"

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false }

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen flex items-center justify-center bg-gray-50'>
					<div className='text-center space-y-4 max-w-sm px-4'>
						<h1 className='text-lg font-semibold text-gray-900'>
							Something went wrong
						</h1>
						<p className='text-sm text-gray-500'>
							An unexpected error occurred. Reload the page to recover.
						</p>
						<button
							type='button'
							onClick={() => window.location.reload()}
							className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors'
						>
							Reload page
						</button>
					</div>
				</div>
			)
		}
		return this.props.children
	}
}
