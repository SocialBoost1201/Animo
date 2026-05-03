export const PROTECTED_OPERATION_WINDOW_LABEL = '19:00〜2:00'

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

export function isPreOpeningReservationTime(value: string | null | undefined): boolean {
  if (!value) return false

  const minutes = parseToMinutes(value)
  return minutes === 20 * 60 || minutes === 20 * 60 + 30
}
