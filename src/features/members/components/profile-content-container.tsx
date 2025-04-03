import { ProfileContent } from '@/features/members/components/profile-content'
import { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import { getSession } from '@/lib/auth/session'

export const ProfileContentContainer = async ({
  workspaceId,
}: Record<'workspaceId', string>) => {
  const session = await getSession()
  const currentMember = await getWorkspaceCurrentMember({
    param: {
      workspaceId,
    },
    userId: session?.user?.id,
  })

  return (
    <ProfileContent
      userId={session?.user?.id}
      currentMember={currentMember}
      workspaceId={workspaceId}
    />
  )
}
