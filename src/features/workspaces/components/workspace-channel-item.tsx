'use client'

import { SidebarItem } from '@/features/workspaces/components/sidebar-item'
import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'
import { useParams } from 'next/navigation'
import type { JSX } from 'react'

type WorkspaceChannelItemProps = Pick<
  InferResponseType<
    (typeof client.api.channels)[':workspaceId']['$get'],
    200
  >['channels'][number],
  'id' | 'name' | 'workspaceId'
> & {
  icon: JSX.Element
}

export const WorkspaceChannelItem = ({
  id,
  name,
  icon,
  workspaceId,
}: WorkspaceChannelItemProps) => {
  const params = useParams<Record<'channelId', string>>()

  return (
    <SidebarItem
      id={id}
      label={name}
      channelIcon={icon}
      workspaceId={workspaceId}
      variant={params.channelId === id ? 'active' : 'default'}
    />
  )
}
