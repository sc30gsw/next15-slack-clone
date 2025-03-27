'use client'

import { Avatar, Loader, Skeleton } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import { MESSAGE_LIMIT } from '@/constants'
import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { Message } from '@/features/messages/components/message'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { getGroupedMessage } from '@/features/messages/utils/get-grouped-messages'
import { Reactions } from '@/features/reactions/components/reactions'
import { formatDateLabel, formatFullTime } from '@/lib/date'
import { useInfiniteQuery } from '@tanstack/react-query'
import { compareDesc, differenceInMinutes, format } from 'date-fns'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Virtuoso } from 'react-virtuoso'

const TIME_THRESHOLD = 5

type VirtuosoMessageListProps = {
  userId?: string
  variant?: 'channel' | 'thread'
}

export const VirtuosoMessageList = ({
  userId,
  variant,
}: VirtuosoMessageListProps) => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [getChannelMessagesCacheKey, params.channelId],
      queryFn: async ({ pageParam = 0 }) => {
        return await getChannelMessages(
          {
            param: { channelId: params.channelId },
            userId,
          },
          pageParam,
        )
      },
      getNextPageParam: (lastPage, allPages) => {
        // ✅ オフセットベースで計算
        return lastPage.length === MESSAGE_LIMIT
          ? allPages.length * MESSAGE_LIMIT
          : undefined
      },
      initialPageParam: 0,
    })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4 p-1.5 px-5">
        {Array.from({ length: 5 }).map(() => (
          <div key={crypto.randomUUID()}>
            <div className="flex items-start gap-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 w-25" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="flex flex-col gap-y-1.5 ml-8">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const allMessages = data?.pages.flat() || []
  const groupedMessages = getGroupedMessage(allMessages)
  const messagesObject = Object.entries(groupedMessages)

  return (
    <Virtuoso
      style={{ height: '100%', paddingBottom: 0 }}
      data={messagesObject}
      itemContent={(_, obj) => {
        const [dateKey, messages] = obj

        const sortedMessages = messages.sort((a, b) =>
          compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
        )
        return (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {sortedMessages.map((message, msgIndex) => {
              const prevMessage = messages[msgIndex - 1]
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
                  isAuthor={message.userId === userId}
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
                      currentUserId={userId}
                    />
                  </div>
                </Message>
              )
            })}
          </div>
        )
      }}
      increaseViewportBy={200}
      // biome-ignore lint/style/useNamingConvention: <explanation>
      components={{ Header: hasNextPage ? MoreButton : undefined }}
      context={{
        loadMore,
        loading: isFetchingNextPage,
        canLoadMore: hasNextPage,
      }}
    />
  )
}

const MoreButton = ({
  context: { loadMore, loading, canLoadMore },
}: {
  context: { loadMore: () => void; loading: boolean; canLoadMore: boolean }
}) => {
  return (
    <>
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore()
                }
              },
              { threshold: 1.0 },
            )

            observer.observe(el)

            return () => observer.disconnect()
          }
        }}
      />
      {loading && (
        <>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader
                size="medium"
                intent="secondary"
                className="animate-spin"
              />
            </span>
          </div>
          <div className="flex flex-col gap-y-4 p-1.5 px-5">
            {Array.from({ length: 2 }).map(() => (
              <div key={crypto.randomUUID()}>
                <div className="flex items-start gap-2">
                  <Skeleton className="size-6" />
                  <Skeleton className="h-4 w-25" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex flex-col gap-y-1.5 ml-8">
                  <Skeleton className="h-3 w-2/5" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
