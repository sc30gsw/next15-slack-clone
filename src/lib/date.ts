import { format, isToday, isYesterday } from 'date-fns'
import 'server-only'

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)

  if (isToday(date)) {
    return 'Today'
  }

  if (isYesterday(date)) {
    return 'Yesterday'
  }

  return format(date, 'EEEE, MMMM d')
}

export const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? 'Today'
      : isYesterday(date)
        ? 'Yesterday'
        : format(date, 'MMM d, yyyy')
  } at ${format(date, 'hh:mm:ss a')}`
}
