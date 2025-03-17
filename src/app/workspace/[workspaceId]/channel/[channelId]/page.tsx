import { Skeleton } from '@/components/justd/ui'
import { ChannelHeader } from '@/features/channels/components/channel-header'
import { Suspense } from 'react'

const ChannelIdPage = ({
  params,
}: Record<'params', Promise<Record<'workspaceId' | 'channelId', string>>>) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b h-12.25 flex items-center px-4 overflow-hidden">
        <Suspense fallback={<Skeleton className="h-9 w-28.5" />}>
          <ChannelHeader params={params} />
        </Suspense>
      </div>
    </div>
  )
}

export default ChannelIdPage
