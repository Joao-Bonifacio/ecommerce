import {
  NextResponse,
  type NextRequest,
  type MiddlewareConfig,
} from 'next/server'
import { env } from './env'

const baseUrl = env.APP_URL

const protectedRoutes = ['/seller', '/settings']
const authRoutes = ['/sign-in', '/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  const isAuthPage = authRoutes.includes(pathname)

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/sign-in', baseUrl))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', baseUrl))
  }

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
