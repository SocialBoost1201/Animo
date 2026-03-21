import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  if (host === 'www.club-animo.jp') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.host = 'club-animo.jp'
    redirectUrl.protocol = 'https'
    return NextResponse.redirect(redirectUrl, 308)
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
