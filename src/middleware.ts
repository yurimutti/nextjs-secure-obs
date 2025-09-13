import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/shared/libs/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/logout', '/']

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value

  const session = await decrypt(sessionCookie)

  // console.log('Middleware - Path:', path)
  // console.log('Middleware - Is Protected Route:', isProtectedRoute)
  // console.log('Middleware - Is Public Route:', isPublicRoute)
  // console.log('Middleware - Session:', session)

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