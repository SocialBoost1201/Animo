export const PROTECTED_OPERATION_WINDOW_LABEL = '21:00〜2:00'

export type OperationTimeOption = {
  value: string
  label: string
}

const OPERATION_START_MINUTES = 19 * 60
const OPERATION_END_MINUTES = 26 * 60
const TIME_STEP_MINUTES = 15

function formatMinutesAsUiTime(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const displayHour = hour24 >= 24 ? hour24 - 24 : hour24

  return `${displayHour}:${String(minute).padStart(2, '0')}`
}

export function getOperationTimeOptions(): OperationTimeOption[] {
  const options: OperationTimeOption[] = []

  for (
    let minutes = OPERATION_START_MINUTES;
    minutes <= OPERATION_END_MINUTES;
    minutes += TIME_STEP_MINUTES
  ) {
    const label = formatMinutesAsUiTime(minutes)
    options.push({ value: label, label })
  }

  return options
}

export function parseToMinutes(value: string): number | null {
  const normalized = value.trim()
  const match = normalized.match(/^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/)

  if (!match) return null

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  if (hour < 0 || hour > 23) return null

  const minutes = hour * 60 + minute

  if (minutes >= OPERATION_START_MINUTES && minutes <= 23 * 60 + 59) {
    return minutes
  }

  if (minutes >= 0 && minutes <= 2 * 60) {
    return minutes + 24 * 60
  }

  return null
}

export function compareOperationTimes(a: string, b: string): number {
  const aMinutes = parseToMinutes(a)
  const bMinutes = parseToMinutes(b)

  if (aMinutes === null && bMinutes === null) return 0
  if (aMinutes === null) return 1
  if (bMinutes === null) return -1

  return aMinutes - bMinutes
}

export function formatProtectedOperationTime(value: string | null | undefined): string {
  if (!value) return ''

  const minutes = parseToMinutes(value)
  if (minutes === null) return ''

  return formatMinutesAsUiTime(minutes)
}

/**
 * Shift rows may store extended clock hours (24–26). Dashboard UI must never show 24/25/26;
 * map to 0:00–2:00 same-night continuation.
 */
export function formatDashboardShiftClockForDisplay(value: string | null | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  const extended = trimmed.match(/^(\d{1,2}):([0-5]\d)/)
  if (extended) {
    const h = Number(extended[1])
    const mm = extended[2]
    if (h >= 24 && h <= 26) {
      return `${h - 24}:${mm}`
    }
  }
  const viaProtected = formatProtectedOperationTime(trimmed)
  if (viaProtected) return viaProtected
  const fallback = trimmed.match(/^(\d{1,2}):([0-5]\d)/)
  if (fallback) {
    const h = Number(fallback[1])
    const mm = fallback[2]
    if (h >= 0 && h <= 23) return `${h}:${mm}`
  }
  return trimmed.length >= 5 ? trimmed.substring(0, 5) : trimmed
}

/** Sort key for shift start/end strings including 24–26 hour storage. */
export function shiftClockToSortMinutes(value: string | null | undefined): number {
  if (!value) return 19 * 60
  const m = value.trim().match(/^(\d{1,2}):([0-5]\d)/)
  if (!m) return 19 * 60
  const h = Number(m[1])
  const min = Number(m[2])
  if (h >= 24 && h <= 26) return (h - 24) * 60 + min + 24 * 60
  if (h >= 19 && h <= 23) return h * 60 + min
  if (h >= 0 && h <= 2) return h * 60 + min + 24 * 60
  return h * 60 + min
}

export function isPreOpeningReservationTime(value: string | null | undefined): boolean {
  if (!value) return false

  const minutes = parseToMinutes(value)
  return minutes === 20 * 60 || minutes === 20 * 60 + 30
}
