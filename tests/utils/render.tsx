// Custom render utility with common providers for component testing
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  providerProps?: {
    queryClient?: QueryClient
  }
}

function customRender(
  ui: React.ReactElement,
  {
    providerProps = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const { queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }) } = providerProps

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }