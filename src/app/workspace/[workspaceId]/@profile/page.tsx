import { Profile } from '@/features/members/components/profile'

export const experimental_ppr = true

const ProfilePage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Profile workspaceId={workspaceId} />
}

export default ProfilePage
