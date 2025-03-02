import { getWorkspaceMembers } from '@/features/members/server/fetcher'
import { UserItem } from '@/features/workspaces/components/user-item'
import { getSession } from '@/lib/auth/session'

type WorkspaceMembersProps = {
  workspaceId: string
}

export const WorkspaceMembers = async ({
  workspaceId,
}: WorkspaceMembersProps) => {
  const session = await getSession()

  const members = await getWorkspaceMembers({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  return members.map((member) => (
    <UserItem
      key={member.userId}
      id={member.user?.id}
      label={member.user?.name}
      image={member.user?.image}
    />
  ))
}
