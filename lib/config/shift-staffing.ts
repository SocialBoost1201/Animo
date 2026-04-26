// Staffing threshold constants for the shift management page.
// Adjust MINIMUM_REQUIRED_CASTS to match the actual business requirement.

export const MINIMUM_REQUIRED_CASTS = 5

export type StaffingLevel = 'enough' | 'low' | 'critical'

// enough:   scheduledWorkingCount >= MINIMUM_REQUIRED_CASTS      (>= 5)
// low:      scheduledWorkingCount >= MINIMUM_REQUIRED_CASTS - 2  (3 or 4)
// critical: scheduledWorkingCount <  MINIMUM_REQUIRED_CASTS - 2  (<= 2)
export function getStaffingLevel(scheduledWorkingCount: number): StaffingLevel {
  if (scheduledWorkingCount >= MINIMUM_REQUIRED_CASTS) return 'enough'
  if (scheduledWorkingCount >= MINIMUM_REQUIRED_CASTS - 2) return 'low'
  return 'critical'
}

export type DailyStaffing = {
  scheduledWorkingCount: number
  level: StaffingLevel
}
