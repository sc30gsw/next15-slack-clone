import { Message } from '@/features/messages/components/message'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { getSession } from '@/lib/auth/session'
import { formatDateLabel } from '@/lib/date'
import { differenceInMinutes, format } from 'date-fns'

const TIME_THRESHOLD = 5

type MessageListProps = {
  channelId: string
}

export const MessageList = async ({ channelId }: MessageListProps) => {
  const session = await getSession()
  const messages = await getChannelMessages(
    {
      param: { channelId },
      userId: session?.user?.id,
    },
    0,
  )

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

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
      {Object.entries(groupedMessages).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1]
            const isCompact =
              prevMessage &&
              prevMessage.userId === message.userId &&
              differenceInMinutes(
                new Date(message.createdAt),
                new Date(prevMessage.createdAt),
              ) < TIME_THRESHOLD

            return (
              <Message
                key={message.id}
                id={message.id}
                body={message.body}
                image={message.image}
                createdAt={message.createdAt}
                updatedAt={message.updatedAt}
                threads={message.threads}
                threadCount={message.threads.length}
                reactions={message.reactions}
                memberId={message.member.userId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isCompact={isCompact}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
