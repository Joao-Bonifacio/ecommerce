import {
  NextResponse,
  type NextRequest,
  type MiddlewareConfig,
} from 'next/server'
import { env } from './env'

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/sign-up', whenAuthenticated: 'redirect' },
  { path: '/settings', whenAuthenticated: 'redirect' },
  { path: '/seller', whenAuthenticated: 'redirect' },
  { path: '/', whenAuthenticated: 'next' },
  { path: '/product', whenAuthenticated: 'next' },
  { path: '/search', whenAuthenticated: 'next' },
] as const
const baseUrl = env.APP_URL

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) => route.path === path)
  const authToken = request.cookies.get('access_token')

  if (!authToken && publicRoute) return NextResponse.next()
  if (!authToken && !publicRoute)
    return NextResponse.redirect(`${baseUrl}/sign-in`)
  if (!authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect')
    return NextResponse.redirect(`${baseUrl}/`)

  // if (authToken && !publicRoute) //verify token valid time
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
