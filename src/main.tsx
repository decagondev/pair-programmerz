import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createLiveblocksContext } from '@liveblocks/react'
import { liveblocksClient } from './modules/config'
import './index.css'
import App from './App.tsx'

/**
 * TanStack Query client
 * 
 * Configured with default options for Firestore queries.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

const { LiveblocksProvider } = createLiveblocksContext(liveblocksClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveblocksProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </LiveblocksProvider>
  </StrictMode>,
)
