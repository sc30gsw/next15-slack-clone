import { ChannelHeaderModal } from '@/features/channels/components/channel-header-modal'
import { getChannel } from '@/features/channels/server/fetcher'
import { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import { getSession } from '@/lib/auth/session'

export const ChannelHeader = async ({
  params,
}: Record<'params', Promise<Record<'workspaceId' | 'channelId', string>>>) => {
  const { workspaceId, channelId } = await params
  const session = await getSession()

  const channel = await getChannel({
    param: { workspaceId, channelId },
    userId: session?.user?.id,
  })

  const currentMemberPromise = getWorkspaceCurrentMember({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  return (
    <ChannelHeaderModal
      name={channel.name}
      currentMemberPromise={currentMemberPromise}
    />
  )
}
