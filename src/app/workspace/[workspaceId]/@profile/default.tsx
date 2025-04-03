import { Profile } from '@/features/members/components/profile'

export const experimental_ppr = true

const ProfileDefault = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Profile workspaceId={workspaceId} />
}

export default ProfileDefault
