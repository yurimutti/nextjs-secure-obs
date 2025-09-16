// Custom renderHook utility with common providers for hook testing
import { renderHook, RenderHookOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

interface CustomRenderHookOptions<TProps> extends Omit<RenderHookOptions<TProps>, 'wrapper'> {
  providerProps?: {
    queryClient?: QueryClient
  }
}

function customRenderHook<TResult, TProps>(
  render: (initialProps: TProps) => TResult,
  {
    providerProps = {},
    ...renderHookOptions
  }: CustomRenderHookOptions<TProps> = {}
) {
  const { queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }) } = providerProps

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  return renderHook(render, { wrapper: Wrapper, ...renderHookOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { customRenderHook as renderHook }