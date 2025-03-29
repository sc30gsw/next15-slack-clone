'use client'

import { Skeleton } from '@/components/justd/ui'
import { MESSAGE_LIMIT } from '@/constants'
import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { LoadMoreButton } from '@/features/messages/components/load-more-button'
import { Message } from '@/features/messages/components/message'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { formatDateLabel } from '@/lib/date'
import { useInfiniteQuery } from '@tanstack/react-query'
import { compareDesc, differenceInMinutes, format } from 'date-fns'
import { useParams } from 'next/navigation'
import { Virtuoso } from 'react-virtuoso'
import { groupBy, map, mapValues, pipe, reverse } from 'remeda'

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

  const groupedMessages = pipe(
    data?.pages.flat() ?? [],
    map((message) => message),
    reverse(),
    groupBy((message) => format(new Date(message.createdAt), 'yyyy-MM-dd')),
    mapValues((messages) => reverse(messages)),
  )

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
                  authorName={message.user.name}
                  authorImage={message.user.image}
                  isCompact={isCompact}
                  threadCount={message.threads.length}
                  reactions={message.reactions}
                  hideThreadButton={variant === 'thread'}
                  userId={userId}
                />
              )
            })}
          </div>
        )
      }}
      increaseViewportBy={200}
      // biome-ignore lint/style/useNamingConvention: This is a prop from the library
      components={{ Header: hasNextPage ? LoadMoreButton : undefined }}
      context={{
        loadMore,
        loading: isFetchingNextPage,
        canLoadMore: hasNextPage,
      }}
    />
  )
}
