import { getChannels } from '@/features/channels/server/fetcher'
import { WorkspaceChannelItem } from '@/features/workspaces/components/workspace-channel-item'
import { getSession } from '@/lib/auth/session'
import { IconHashtag } from 'justd-icons'

type WorkspaceChannelsProps = {
  workspaceId: string
}

export const WorkspaceChannels = async ({
  workspaceId,
}: WorkspaceChannelsProps) => {
  const session = await getSession()
  const channels = await getChannels({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  return channels.map((channel) => (
    <WorkspaceChannelItem
      key={channel.id}
      id={channel.id}
      name={channel.name}
      workspaceId={workspaceId}
      icon={<IconHashtag className="size-3.5 mr-1 shrink-0" />}
    />
  ))
}
