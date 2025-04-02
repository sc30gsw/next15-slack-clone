import { getMemberCacheKey } from '@/constants/cache-keys'
import { useProfileMemberId } from '@/features/members/hooks/user-profile-member-id'
import { useParentMessageId } from '@/features/messages/hooks/use-parent-message-id'
import { useQueryClient } from '@tanstack/react-query'

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()
  const { profileMemberId, setProfileMemberIdParsers } = useProfileMemberId()
  const queryClient = useQueryClient()

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId)
    setProfileMemberIdParsers({
      profileMemberId: null,
    })
  }

  const onOpenProfile = (memberId: string) => {
    setProfileMemberIdParsers({
      profileMemberId: memberId,
    })
    queryClient.invalidateQueries({
      queryKey: [getMemberCacheKey, memberId],
    })
    setParentMessageId(null)
  }

  const onClose = () => {
    setParentMessageId(null)
    setProfileMemberIdParsers({
      profileMemberId: null,
    })
  }

  return {
    parentMessageId,
    profileMemberId,
    onOpenMessage,
    onOpenProfile,
    onClose,
  } as const
}
