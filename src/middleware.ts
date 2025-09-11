import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/shared/libs/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/logout', '/']

export default async function middleware(req: NextRequest) {
  console.log('🚀 Middleware running for path:', req.nextUrl.pathname)

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  console.log('Path analysis:', { path, isProtectedRoute, isPublicRoute })

  // 3. Decrypt the session from the cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  const authTokenCookie = cookieStore.get('auth-token')?.value

  console.log('All cookies:', cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })))
  console.log('Session cookie:', sessionCookie ? 'exists' : 'missing')
  console.log('Auth-token cookie:', authTokenCookie ? 'exists' : 'missing')

  const session = await decrypt(sessionCookie)
  console.log('Decrypted session:', session)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.token &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}