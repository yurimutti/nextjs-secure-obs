import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/user-profile', ({ request }) => {
    const cookieHeader = request.headers.get('cookie')

    if (!cookieHeader || !cookieHeader.includes('access_token')) {
      return new HttpResponse(null, { status: 401 })
    }

    return HttpResponse.json({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      memberSince: '2023-01-01T00:00:00.000Z',
    })
  }),
  http.get('/api/user-profile-401', () => {
    return new HttpResponse(null, { status: 401 })
  }),

  http.get('/api/recent-activities', ({ request }) => {
    const cookieHeader = request.headers.get('cookie')

    if (!cookieHeader || !cookieHeader.includes('access_token')) {
      return new HttpResponse(null, { status: 401 })
    }

    return HttpResponse.json({
      activities: [
        {
          id: '1',
          type: 'login',
          timestamp: '2023-01-01T10:00:00.000Z',
          description: 'User logged in',
        },
      ],
      total: 1,
    })
  }),

  http.get('/api/recent-activities-401', () => {
    return new HttpResponse(null, { status: 401 })
  }),
]