import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, AUTH_COOKIE } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and API auth routes through without checking
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const username = await verifySessionToken(token)
  if (!username) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.delete(AUTH_COOKIE)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
