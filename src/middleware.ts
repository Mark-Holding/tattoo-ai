import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple logging for middleware
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] Middleware: ${message}`, data || '')
}

export async function middleware(req: NextRequest) {
  log('Request received:', {
    method: req.method,
    path: req.nextUrl.pathname,
    headers: Object.fromEntries(req.headers)
  })
  
  // Create a response object that we can modify
  const res = NextResponse.next()
  
  try {
    // Create a Supabase client with the Request and Response
    const supabase = createMiddlewareClient({ req, res })

    // Try to refresh the session
    const { data: { session }, error } = await supabase.auth.getSession()

    // Log cookies for debugging
    log('Cookies:', {
      all: req.cookies.toString(),
      auth: req.cookies.get('sb-auth-token')?.value
    })

    if (error) {
      log('Session error:', error)
      return res
    }

    log('Middleware session check:', { 
      hasSession: !!session, 
      path: req.nextUrl.pathname,
      session: session ? {
        user: session.user?.id,
        expires_at: session.expires_at
      } : null
    })

    // If no session and trying to access protected route
    if (!session && (
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/profile')
    )) {
      log('No session, redirecting to login')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }

    // If session exists and trying to access login/signup
    if (session && (
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname === '/'
    )) {
      log('Session exists, redirecting to dashboard')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    log('Middleware allowing request through')
    return res
  } catch (e) {
    log('Middleware error:', e)
    return res
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/login'
  ]
} 