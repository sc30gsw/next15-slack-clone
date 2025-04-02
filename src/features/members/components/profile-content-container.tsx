import { ProfileContent } from '@/features/members/components/profile-content'
import { getSession } from '@/lib/auth/session'

export const ProfileContentContainer = async () => {
  const session = await getSession()

  return <ProfileContent userId={session?.user?.id} />
}
