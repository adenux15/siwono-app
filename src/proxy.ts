import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that do not require authentication
const publicPaths = ['/login']

// Add paths that require admin access
const adminOnlyPaths = ['/petugas', '/petugas/tambah']

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('session')
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
  
  // If no session and trying to access private route, redirect to login
  if (!sessionCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's a session and user is on a public path (like /login), redirect to dashboard
  if (sessionCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check role-based access
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value)
      
      const isAdminOnlyPath = adminOnlyPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
      
      if (isAdminOnlyPath && session.role !== 'admin') {
        // If not admin and trying to access admin route, redirect to dashboard or home
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Invalid session cookie format, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session')
      return response
    }
  }



  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
