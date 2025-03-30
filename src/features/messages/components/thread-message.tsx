'use client'
import { Skeleton } from '@/components/justd/ui'
import { Message } from '@/features/messages/components/message'
import { MessageListLoader } from '@/features/messages/components/message-list-loader'
import { ThreadInput } from '@/features/messages/components/thread-input'
import { VirtuosoThreads } from '@/features/messages/components/virtuoso-threads'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { useThreadMessage } from '@/features/messages/hooks/use-thread-message'
import { IconTriangleExclamation } from 'justd-icons'

export const ThreadMessage = ({
  userId,
}: Partial<Record<'userId', string>>) => {
  const { parentMessageId } = usePanel()
  const {
    isError,
    data: message,
    isLoading,
  } = useThreadMessage(parentMessageId, userId)

  if (isLoading || !parentMessageId) {
    return (
      <>
        <MessageListLoader length={1} />
        <div className="flex justify-center items-center">
          <Skeleton className="h-39 w-[90%] mx-4 mb-2" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-muted-fg" />
        <p className="text-sm text-muted-fg">Message not found</p>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-muted-fg" />
        <p className="text-sm text-muted-fg">Message not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <Message
          id={message.id}
          body={message.body}
          image={message.image}
          createdAt={message.createdAt}
          isUpdated={message.isUpdated}
          memberId={message.member.userId}
          isAuthor={message.userId === userId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isCompact={false}
          reactions={message.reactions}
          hideThreadButton={true}
          userId={userId}
          firstThread={undefined}
        />
      </div>

      <VirtuosoThreads userId={userId} />

      <div className="px-4">
        <ThreadInput userId={userId} />
      </div>
    </div>
  )
}
