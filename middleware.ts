import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const ADMIN_DESKTOP_AUTH_PATHS = new Set([
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/admin/reset-password',
])

function isAdminDesktopAuthPath(pathname: string) {
  return ADMIN_DESKTOP_AUTH_PATHS.has(pathname)
}

function isAdminMobileAuthPath(pathname: string) {
  return (
    pathname.startsWith('/admin/m/') &&
    ADMIN_DESKTOP_AUTH_PATHS.has(pathname.replace('/admin/m', '/admin'))
  )
}

function preferMobileView(request: NextRequest) {
  const forcedView = request.nextUrl.searchParams.get('view')
  if (forcedView === 'desktop') return false
  if (forcedView === 'mobile') return true

  const userAgent = request.headers.get('user-agent') ?? ''
  // 誤判定を避けるため、タブレットはデスクトップ扱いに寄せる
  if (/iPad/i.test(userAgent)) return false
  return /Android|iPhone|iPod|Mobi/i.test(userAgent)
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  if (host === 'www.club-animo.jp') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.host = 'club-animo.jp'
    redirectUrl.protocol = 'https'
    return NextResponse.redirect(redirectUrl, 308)
  }

  // === Admin Auth (Desktop/Mobile) routing ===
  // 端末判定で /admin/* と /admin/m/* を行き来させる（view=desktop|mobile で固定可能）
  const pathname = request.nextUrl.pathname
  const shouldMobile = preferMobileView(request)

  if (isAdminDesktopAuthPath(pathname) && shouldMobile) {
    const url = request.nextUrl.clone()
    url.pathname = `/admin/m${pathname.replace('/admin', '')}`
    return NextResponse.redirect(url)
  }

  if (isAdminMobileAuthPath(pathname) && !shouldMobile) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/admin/m', '/admin')
    return NextResponse.redirect(url)
  }

  // === Rate Limit (Simple in-memory) ===
  // フォーム送信等、POSTリクエスト（Server Action含む）に対する簡易的制限
  if (request.method === 'POST') {
    // 例: 1分間に10リクエストまで
    const { success } = checkRateLimit(request, 10, 60 * 1000);
    if (!success) {
      console.warn(`[RateLimit] Too many requests from ${request.headers.get('x-forwarded-for') || 'unknown'}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // === Supabase Session ===
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
