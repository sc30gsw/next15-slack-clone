import { Skeleton } from '@/components/justd/ui'
import { ChannelHeader } from '@/features/channels/components/channel-header'
import { ChatInput } from '@/features/channels/components/chat-input'
import { getChannel } from '@/features/channels/server/fetcher'
import { MessageList } from '@/features/messages/components/message-lits'
import { getSession } from '@/lib/auth/session'
import { Suspense } from 'react'

export const experimental_ppr = true

const ChannelIdPage = async ({
  params,
}: Record<'params', Promise<Record<'workspaceId' | 'channelId', string>>>) => {
  const { workspaceId, channelId } = await params

  const session = await getSession()

  const channelPromise = getChannel({
    param: { workspaceId, channelId },
    userId: session?.user?.id,
  })

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b h-12.25 flex items-center px-4 overflow-hidden">
        <Suspense fallback={<Skeleton className="h-9 w-28.5" />}>
          <ChannelHeader workspaceId={workspaceId} channelId={channelId} />
        </Suspense>
      </div>
      <div className="flex-1" />
      <Suspense
        fallback={
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
        }
      >
        <MessageList workspaceId={workspaceId} channelId={channelId} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-39 w-248 mx-5 mb-2" />}>
        {channelPromise.then((channel) => (
          <ChatInput placeholder={`Message # ${channel.name}`} />
        ))}
      </Suspense>
    </div>
  )
}

export default ChannelIdPage
