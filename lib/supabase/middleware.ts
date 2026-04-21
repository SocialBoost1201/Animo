import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getAppRole, isAdminLoginRole } from '@/lib/auth/admin-roles'
import {
  CAST_REAUTH_WINDOW_DAYS,
  CAST_REAUTH_COOKIE_NAME,
  isCastPortalPublicPath,
  isCastPortalProtectedPath,
} from '@/lib/cast-auth-utils'

const ADMIN_PUBLIC_PATHS = new Set([
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/m/login',
  '/admin/m/register',
  '/admin/m/forgot-password',
  '/admin/m/reset-password',
])
const STAFF_ADMIN_PATHS = new Set(['/admin', '/admin/dashboard'])

async function getLinkedCastData(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  const { data } = await supabase
    .from('casts')
    .select('id, last_sms_verified_at')
    .eq('auth_user_id', userId)
    .maybeSingle()

  return data
}

function redirectToSafeDestination(request: NextRequest, role: string | null) {
  const url = request.nextUrl.clone()
  url.pathname = role === 'cast' ? '/cast/dashboard' : '/'
  return NextResponse.redirect(url)
}

function preferCastMobileView(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  if (/iPad/i.test(ua)) return false
  return /Android|iPhone|iPod|Mobi/i.test(ua)
}

function createCastAuthRedirect(request: NextRequest, kind: 'login' | 'verify', reauth = false) {
  const url = request.nextUrl.clone()
  const prefix = preferCastMobileView(request) ? '/cast/m' : '/cast'
  url.pathname = `${prefix}/${kind}`
  if (reauth) {
    url.searchParams.set('reauth', '1')
  } else {
    url.searchParams.delete('reauth')
  }
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // 環境変数が未設定の場合は処理をスキップ（サイトダウンを防ぐ）
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Protect /admin routes
  if (pathname.startsWith('/admin') && !ADMIN_PUBLIC_PATHS.has(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Redirect /admin directly to /admin/dashboard
    if (pathname === '/admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    const role = await getAppRole(supabase, user.id)

    if (!isAdminLoginRole(role)) {
      return redirectToSafeDestination(request, role)
    }

    if (role === 'staff' && !STAFF_ADMIN_PATHS.has(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged in users away from auth pages
  if (ADMIN_PUBLIC_PATHS.has(pathname) && user) {
    const role = await getAppRole(supabase, user.id)

    if (!isAdminLoginRole(role)) {
      return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  if (isCastPortalProtectedPath(pathname)) {
    if (!user) {
      return createCastAuthRedirect(request, 'login')
    }

    const role = await getAppRole(supabase, user.id)
    const castData = await getLinkedCastData(supabase, user.id)

    if (role !== 'cast' && !castData) {
      return redirectToSafeDestination(request, role)
    }

    const lastVerifiedRaw = castData?.last_sms_verified_at
    const daysSince = lastVerifiedRaw
      ? (Date.now() - new Date(lastVerifiedRaw).getTime()) / 86_400_000
      : Infinity

    const reauthCookie = request.cookies.get(CAST_REAUTH_COOKIE_NAME)?.value
    const isValidCookie = reauthCookie && parseInt(reauthCookie, 10) > Date.now()
    const isValidSession = isValidCookie && daysSince < CAST_REAUTH_WINDOW_DAYS

    if (!isValidSession) {
      return createCastAuthRedirect(request, 'verify', true)
    }
  }

  if (isCastPortalPublicPath(pathname) && user) {
    const role = await getAppRole(supabase, user.id)
    const castData = await getLinkedCastData(supabase, user.id)

    if (role !== 'cast' && !castData) {
      return supabaseResponse
    }

    const lastVerifiedRaw = castData?.last_sms_verified_at
    const daysSince = lastVerifiedRaw
      ? (Date.now() - new Date(lastVerifiedRaw).getTime()) / 86_400_000
      : Infinity

    const reauthCookie = request.cookies.get(CAST_REAUTH_COOKIE_NAME)?.value
    const isValidCookie = reauthCookie && parseInt(reauthCookie, 10) > Date.now()
    const isValidSession = isValidCookie && daysSince < CAST_REAUTH_WINDOW_DAYS

    const isVerifyPath = pathname === '/cast/verify' || pathname === '/cast/m/verify'
    if (isValidSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/cast/dashboard'
      url.searchParams.delete('reauth')
      return NextResponse.redirect(url)
    }

    if (!isVerifyPath && request.nextUrl.searchParams.get('reauth') === '1') {
      return createCastAuthRedirect(request, 'verify', true)
    }
  }

  return supabaseResponse
}
