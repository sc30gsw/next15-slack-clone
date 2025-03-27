import { Skeleton } from '@/components/justd/ui'
import { ChannelHero } from '@/features/channels/components/channel-hero'
import { getChannel } from '@/features/channels/server/fetcher'
import { Message } from '@/features/messages/components/message'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { getSession } from '@/lib/auth/session'
import { formatDateLabel } from '@/lib/date'
import { differenceInMinutes, format } from 'date-fns'
import { Suspense } from 'react'

const TIME_THRESHOLD = 5

type MessageListProps = {
  workspaceId: string
  channelId: string
  variant?: 'channel' | 'thread'
}

export const MessageList = async ({
  workspaceId,
  channelId,
  variant = 'channel',
}: MessageListProps) => {
  const session = await getSession()

  const channelPromise = getChannel({
    param: { workspaceId, channelId },
    userId: session?.user?.id,
  })

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
                isUpdated={message.isUpdated}
                threads={message.threads}
                reactions={message.reactions}
                memberId={message.member.userId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.userId === session?.user?.id}
                isCompact={isCompact}
                threadCount={message.threads.length}
                hideThreadButton={variant === 'thread'}
              />
            )
          })}
        </div>
      ))}
      {variant === 'channel' && (
        <Suspense
          fallback={
            <div className="mt-22 mx-5 mb-4">
              <Skeleton className="h-8 w-30 mb-2" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          }
        >
          {channelPromise.then(
            (channel) =>
              channel.name &&
              channel.createdAt && (
                <ChannelHero
                  name={channel.name}
                  creationTime={channel.createdAt}
                />
              ),
          )}
        </Suspense>
      )}
    </div>
  )
}
