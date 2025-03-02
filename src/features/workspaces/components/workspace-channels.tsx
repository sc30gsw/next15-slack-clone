import { getChannels } from '@/features/channels/server/fetcher'
import { SidebarItem } from '@/features/workspaces/components/sidebar-item'
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
    <SidebarItem
      key={channel.id}
      id={channel.id}
      label={channel.name}
      icon={IconHashtag}
      workspaceId={workspaceId}
    />
  ))
}
