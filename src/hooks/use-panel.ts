import { useProfileMemberId } from '@/features/members/hooks/user-profile-member-id'
import { useParentMessageId } from '@/features/messages/hooks/use-parent-message-id'

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()
  const { profileMemberId, setProfileMemberIdParsers } = useProfileMemberId()

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
