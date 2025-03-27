import type { client } from '@/lib/rpc'
import { format } from 'date-fns'
import type { InferResponseType } from 'hono'

export const getGroupedMessage = (
  messages: InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >['messages'],
) => {
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt)
      const dateKey = format(date, 'yyyy-MM-dd')

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)

      return groups
    },
    {} as Record<string, typeof messages>,
  )

  return groupedMessages
}
