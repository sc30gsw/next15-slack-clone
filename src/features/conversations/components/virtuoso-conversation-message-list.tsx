'use client'
import { useConversationMessages } from '@/features/conversations/hooks/use-conversation-messages'
import { LoadMoreButton } from '@/features/messages/components/load-more-button'
import { Message } from '@/features/messages/components/message'
import { MessageListLoader } from '@/features/messages/components/message-list-loader'
import { formatDateLabel } from '@/lib/date'
import { compareDesc, differenceInMinutes, format } from 'date-fns'
import { Virtuoso } from 'react-virtuoso'
import { filter, groupBy, map, mapValues, pipe, reverse, sort } from 'remeda'

const TIME_THRESHOLD = 5

type VirtuosoConversationMessageListProps = {
  conversationId: string
  userId?: string
  variant?: 'channel' | 'thread' | 'conversation'
}

export const VirtuosoConversationMessageList = ({
  conversationId,
  userId,
  variant,
}: VirtuosoConversationMessageListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useConversationMessages(conversationId, userId)

  if (isLoading) {
    return <MessageListLoader />
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

        const sortedMessages = pipe(
          messages,
          sort((a, b) =>
            compareDesc(new Date(a.createdAt), new Date(b.createdAt)),
          ),
          filter((message) => message.parentMessageId === null),
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
                  memberId={message.member.userId}
                  isAuthor={message.userId === userId}
                  authorName={message.user.name}
                  authorImage={message.user.image}
                  isCompact={isCompact}
                  threadCount={message.threadCount[0].count}
                  firstThread={message.firstThread}
                  reactions={message.reactions}
                  hideThreadButton={variant === 'thread'}
                  isConversationCache={true}
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
