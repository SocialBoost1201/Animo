const CAST_PORTAL_PUBLIC_PATHS = new Set([
  '/cast/login',
  '/cast/verify',
  '/cast/register',
  '/cast/forgot-password',
  '/cast/reset-password',
  '/cast/verify-email',
  '/cast/m/login',
  '/cast/m/verify',
  '/cast/m/register',
  '/cast/m/forgot-password',
])

const CAST_PORTAL_PROTECTED_PREFIXES = [
  '/cast/dashboard',
  '/cast/posts',
  '/cast/post',
  '/cast/shift',
  '/cast/monthly-shift',
  '/cast/notices',
  '/cast/today',
  '/cast/profile',
  '/cast/schedule',
]

export const CAST_REAUTH_COOKIE_NAME = 'cast_reauth_until'
export const CAST_REAUTH_WINDOW_DAYS = 14
export const CAST_REAUTH_WINDOW_MS = CAST_REAUTH_WINDOW_DAYS * 24 * 60 * 60 * 1000

function toHalfWidthDigits(value: string) {
  return value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
}

export function normalizeCastPhone(value: string) {
  return toHalfWidthDigits(value).replace(/[^\d]/g, '')
}

export function toE164JpPhone(value: string) {
  const normalized = normalizeCastPhone(value)

  if (/^0\d{9,10}$/.test(normalized)) {
    return `+81${normalized.slice(1)}`
  }

  if (/^81\d{9,10}$/.test(normalized)) {
    return `+${normalized}`
  }

  if (/^\+81\d{9,10}$/.test(value.trim())) {
    return value.trim()
  }

  return null
}

export function isCastPortalPublicPath(pathname: string) {
  return CAST_PORTAL_PUBLIC_PATHS.has(pathname)
}

export function isCastPortalProtectedPath(pathname: string) {
  return CAST_PORTAL_PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
