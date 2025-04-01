'use client'

import type { getWorkspaceMembers } from '@/features/members/server/fetcher'
import { UserItem } from '@/features/workspaces/components/user-item'
import { useParams } from 'next/navigation'
import { use } from 'react'

export const WorkspaceMembers = ({
  membersPromise,
}: Record<'membersPromise', ReturnType<typeof getWorkspaceMembers>>) => {
  const members = use(membersPromise)
  const params = useParams<{ workspaceId: string; memberId?: string }>()

  return members.map((member) => (
    <UserItem
      key={member.userId}
      id={member.user?.id}
      label={member.user?.name}
      image={member.user?.image}
      variant={member.userId === params.memberId ? 'active' : 'default'}
    />
  ))
}
