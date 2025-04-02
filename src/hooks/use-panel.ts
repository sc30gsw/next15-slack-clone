import { useProfileMemberId } from '@/features/members/hooks/user-profile-member-id'
import { useParentMessageId } from '@/features/messages/hooks/use-parent-message-id'

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()
  const [profileMemberId, setProfileMemberId] = useProfileMemberId()

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId)
  }

  const onOpenProfile = (messageId: string) => {
    setProfileMemberId(messageId)
  }

  const onClose = () => {
    setParentMessageId(null)
  }

  const onCloseProfile = () => {
    setProfileMemberId(null)
  }

  return {
    parentMessageId,
    profileMemberId,
    onOpenMessage,
    onOpenProfile,
    onClose,
    onCloseProfile,
  } as const
}
