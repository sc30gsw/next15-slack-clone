import { Profile } from '@/features/members/components/profile'
import { profileMemberIdCache } from '@/features/members/types/search-params/profile-member-id-cache'
import type { SearchParams } from 'nuqs'

export const experimental_ppr = true

const ProfileDefault = async ({
  searchParams,
}: Record<'searchParams', Promise<SearchParams>>) => {
  await profileMemberIdCache.parse(searchParams)

  return <Profile />
}

export default ProfileDefault
