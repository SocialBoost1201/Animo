const JST_TIME_ZONE = 'Asia/Tokyo'

function getPartMap(
  date: Date,
  options: Intl.DateTimeFormatOptions
): Record<string, string> {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: JST_TIME_ZONE,
    ...options,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value
      }
      return acc
    }, {})
}

export function getJstDateString(date: Date = new Date()): string {
  const parts = getPartMap(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return `${parts.year}-${parts.month}-${parts.day}`
}

export function getJstDateLabel(date: Date = new Date()): string {
  const parts = getPartMap(date, {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  })

  return `${parts.month}月${parts.day}日（${parts.weekday}）`
}
