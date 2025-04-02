import { LoadMoreButton } from '@/features/messages/components/load-more-button'
import { Message } from '@/features/messages/components/message'
import { MessageListLoader } from '@/features/messages/components/message-list-loader'
import { useThreads } from '@/features/messages/hooks/use-threads'
import { usePanel } from '@/hooks/use-panel'
import { formatDateLabel } from '@/lib/date'
import { compareDesc, differenceInMinutes, format } from 'date-fns'
import { Virtuoso } from 'react-virtuoso'
import { groupBy, map, mapValues, pipe, reverse } from 'remeda'

const TIME_THRESHOLD = 5

type VirtuosoThreadsProps = {
  userId?: string
  variant?: 'channel' | 'thread'
}

export const VirtuosoThreads = ({ userId, variant }: VirtuosoThreadsProps) => {
  const { parentMessageId } = usePanel()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useThreads(parentMessageId, userId)

  if (isLoading) {
    return <MessageListLoader />
  }

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const threads = data?.pages.flat()

  if (!threads || threads.length === 0) {
    return null
  }

  const groupedThreads = pipe(
    threads,
    map((thread) => thread),
    reverse(),
    groupBy((thread) => format(new Date(thread.createdAt), 'yyyy-MM-dd')),
    mapValues((threads) => reverse(threads)),
  )

  const threadsObject = Object.entries(groupedThreads)

  return (
    <Virtuoso
      style={{ height: '100%', paddingBottom: 0 }}
      data={threadsObject}
      itemContent={(_, obj) => {
        const [dateKey, threads] = obj

        const sortedThreads = threads.sort((a, b) =>
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
            {sortedThreads.map((thread, msgIndex) => {
              const prevMessage = threads[msgIndex - 1]
              const isCompact =
                prevMessage &&
                prevMessage.userId === thread.userId &&
                differenceInMinutes(
                  new Date(thread.createdAt),
                  new Date(prevMessage.createdAt),
                ) < TIME_THRESHOLD

              return (
                <Message
                  key={thread.id}
                  id={thread.id}
                  body={thread.body}
                  image={thread.image}
                  createdAt={thread.createdAt}
                  isUpdated={thread.isUpdated}
                  isAuthor={thread.userId === userId}
                  authorName={thread.user.name}
                  authorImage={thread.user.image}
                  isCompact={isCompact}
                  threadCount={thread.threadCount[0].count}
                  firstThread={
                    thread.threadCount[0].count > 0
                      ? thread.firstThread
                      : undefined
                  }
                  reactions={thread.reactions}
                  hideThreadButton={variant === 'thread'}
                  userId={userId}
                  isThreadCache={true}
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
