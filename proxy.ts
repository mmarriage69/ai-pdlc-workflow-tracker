import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'pdlc-auth'

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.has(AUTH_COOKIE)
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'

  // Unauthenticated → redirect to /login (except when already on /login)
  if (!isAuth && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated → redirect away from /login to dashboard
  if (isAuth && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
