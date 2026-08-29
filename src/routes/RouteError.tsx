import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from './paths'

export function RouteError() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 max-w-sm px-4">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Return home to recover.
        </p>
        <Button onClick={() => navigate(ROUTES.board)}>Go home</Button>
      </div>
    </div>
  )
}
