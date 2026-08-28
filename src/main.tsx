import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { router } from '@/routes/index'
import './index.css'

async function bootstrap() {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </ErrorBoundary>
    </StrictMode>,
  )
}

bootstrap()
