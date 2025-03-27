import { Skeleton } from '@/components/justd/ui'
import { ChannelHero } from '@/features/channels/components/channel-hero'
import { getChannel } from '@/features/channels/server/fetcher'
import { VirtuosoMessageList } from '@/features/messages/components/virtuoso-message-list'
import { getSession } from '@/lib/auth/session'
import {} from '@/lib/date'
import { Suspense } from 'react'

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

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
      <VirtuosoMessageList userId={session?.user?.id} variant={variant} />
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
