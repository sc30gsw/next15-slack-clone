import { Avatar, Skeleton } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import { ChannelHero } from '@/features/channels/components/channel-hero'
import { getChannel } from '@/features/channels/server/fetcher'
import { Message } from '@/features/messages/components/message'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { Reactions } from '@/features/reactions/components/reactions'
import { getSession } from '@/lib/auth/session'
import { formatDateLabel, formatFullTime } from '@/lib/date'
import { differenceInMinutes, format } from 'date-fns'
import Image from 'next/image'
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
                memberId={message.member.userId}
                isAuthor={message.userId === session?.user?.id}
                isCompact={isCompact}
                threadCount={message.threads.length}
                hideThreadButton={variant === 'thread'}
                authorAvatar={
                  <Avatar
                    alt={message.user.name ?? 'Member'}
                    size="small"
                    shape="square"
                    src={message.user.image}
                    initials={message.user.name?.charAt(0).toUpperCase()}
                    className="bg-sky-500 text-white"
                  />
                }
                createdAtHint={
                  <Hint
                    label={formatFullTime(new Date(message.createdAt))}
                    showArrow={false}
                  >
                    <div className="text-xs text-muted-fg opacity-0 group-hover:opacity-100 w-10 leading-5.5 text-center hover:underline">
                      {format(new Date(message.createdAt), 'hh:mm')}
                    </div>
                  </Hint>
                }
              >
                {isCompact ? (
                  <div className="flex flex-col w-full">
                    <Renderer value={message.body} />
                    {message.image && (
                      <Thumbnail
                        modalContentImage={
                          <Image
                            src={message.image}
                            alt="Message image"
                            height={100}
                            width={100}
                            className="rounded-md object-cover size-full"
                          />
                        }
                      >
                        <Image
                          src={message.image}
                          alt="Message image"
                          height={100}
                          width={100}
                          className="rounded-md object-cover size-full"
                        />
                      </Thumbnail>
                    )}
                    {message.isUpdated === 1 && (
                      <span className="text-xs text-muted-fg">(edited)</span>
                    )}
                    <Reactions
                      reactions={message.reactions}
                      messageId={message.id}
                      currentUserId={session?.user?.id}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                      <button
                        type="button"
                        className="font-bold  hover:underline cursor-pointer"
                      >
                        {message.user.name}
                      </button>
                      <span>&nbsp;&nbsp;</span>
                      <Hint
                        label={formatFullTime(new Date(message.createdAt))}
                        showArrow={false}
                      >
                        <div className="text-sm text-muted-fg hover:underline">
                          {format(new Date(message.createdAt), 'h:mm a')}
                        </div>
                      </Hint>
                    </div>
                    <Renderer value={message.body} />
                    {message.image && (
                      <Thumbnail
                        modalContentImage={
                          <Image
                            src={message.image}
                            alt="Message image"
                            height={100}
                            width={100}
                            className="rounded-md object-cover size-full"
                          />
                        }
                      >
                        <Image
                          src={message.image}
                          alt="Message image"
                          height={100}
                          width={100}
                          className="rounded-md object-cover size-full"
                        />
                      </Thumbnail>
                    )}
                    {message.isUpdated === 1 && (
                      <span className="text-xs text-muted-fg">(edited)</span>
                    )}
                    <Reactions
                      reactions={message.reactions}
                      messageId={message.id}
                      currentUserId={session?.user?.id}
                    />
                  </div>
                )}
              </Message>
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
