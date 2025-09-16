import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { server } from '../msw/server'

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  })
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
  jest.useRealTimers()
})

afterAll(() => {
  server.close()
})

const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})