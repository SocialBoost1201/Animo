import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_ADMIN_ROLES = new Set(['owner', 'manager', 'admin'])

async function getAppRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (profile?.role) {
    return profile.role
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  return userRole?.role ?? null
}

function redirectToSafeDestination(request: NextRequest, role: string | null) {
  const url = request.nextUrl.clone()
  url.pathname = role === 'cast' ? '/cast/dashboard' : '/'
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
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
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

    if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
      return redirectToSafeDestination(request, role)
    }
  }

  // Redirect logged in users away from login page
  if (pathname.startsWith('/admin/login') && user) {
    const role = await getAppRole(supabase, user.id)

    if (!role || !ALLOWED_ADMIN_ROLES.has(role)) {
      return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
