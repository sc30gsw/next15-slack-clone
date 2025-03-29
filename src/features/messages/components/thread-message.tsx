'use client'

import { Loader } from '@/components/justd/ui'
import { Message } from '@/features/messages/components/message'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { useThreadMessage } from '@/features/messages/hooks/use-thread-message'
import { IconTriangleExclamation } from 'justd-icons'

export const ThreadMessage = ({
  userId,
}: Partial<Record<'userId', string>>) => {
  const { parentMessageId } = usePanel()
  const {
    isFetching,
    isError,
    data: message,
  } = useThreadMessage(parentMessageId, userId)

  if (isFetching || !parentMessageId) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="medium" className="animate-spin" />
      </div>
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
        threadCount={message.threads.length}
        threads={message.threads}
        reactions={message.reactions}
        hideThreadButton={true}
        userId={userId}
      />
    </div>
  )
}
