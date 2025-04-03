import { profileMemberIdParsers } from '@/features/members/types/search-params/profile-member-id-cache'
import { useQueryStates } from 'nuqs'

export const useProfileMemberId = () => {
  const [{ profileMemberId }, setProfileMemberIdParsers] = useQueryStates(
    profileMemberIdParsers,
    { shallow: false, history: 'push' },
  )

  return {
    profileMemberId,
    setProfileMemberIdParsers,
  } as const
}
