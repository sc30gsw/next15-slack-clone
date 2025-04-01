import {
  getConversationMessagesCacheKey,
  getMessageCacheKey,
  getThreadsCacheKey,
} from '@/constants/cache-keys'
import { deleteMessageAction } from '@/features/messages/actions/delete-message-action'
import { updateMessageAction } from '@/features/messages/actions/update-message-action'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { toggleReactionAction } from '@/features/reactions/action/toggle-reaction-action'
import { reactionRevalidate } from '@/features/reactions/utils/reaction-revalidate'
import { Confirm } from '@/hooks/use-confirm'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const useMessage = (
  id: string,
  isConversationCache: boolean,
  isThreadCache: boolean,
) => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

  const queryClient = useQueryClient()

  const { parentMessageId, onOpenMessage, onClose } = usePanel()

  const [editMessageId, setEditMessageId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isDeletionPending, startDeletionTransition] = useTransition()

  const isEditing = editMessageId === id

  const handleUpdate = ({ body }: Record<'body', string>) => {
    startTransition(async () => {
      const result = await updateMessageAction({
        id,
        body,
        workspaceId: params.workspaceId,
        channelId: params.channelId,
      })

      if (result.status === 'error') {
        toast.error('Failed to update message')
        return
      }

      toast.success('Message updated')

      queryClient.invalidateQueries({
        queryKey: [getMessageCacheKey, result.initialValue?.id],
      })

      const listDataRevalidate = () => {
        if (isConversationCache) {
          reactionRevalidate(
            'conversation',
            queryClient,
            result.initialValue?.conversationId ?? '',
          )
        } else {
          reactionRevalidate('messages', queryClient, params.channelId)
        }
      }

      listDataRevalidate()

      setEditMessageId(null)

      if (isThreadCache) {
        queryClient.invalidateQueries({
          queryKey: [getThreadsCacheKey, parentMessageId],
        })

        listDataRevalidate()
      }
    })
  }

  const handleDelete = async () => {
    const ok = await Confirm.call({
      title: 'Delete message?',
      message:
        'Are you sure you want to delete this message? This cannot be undone.',
    })

    if (!ok) {
      return
    }

    startDeletionTransition(async () => {
      const result = await deleteMessageAction(id, params.workspaceId)

      if (result.status === 'error') {
        toast.error('Failed to delete message')

        return
      }

      toast.success('Message deleted')

      const listDataRevalidate = () => {
        if (isConversationCache) {
          reactionRevalidate(
            'conversation',
            queryClient,
            result.initialValue?.conversationId ?? '',
          )
        } else {
          reactionRevalidate('messages', queryClient, params.channelId)
        }
      }

      listDataRevalidate()

      if (isThreadCache) {
        queryClient.invalidateQueries({
          queryKey: [getThreadsCacheKey, parentMessageId],
        })

        queryClient.invalidateQueries({
          queryKey: [
            getConversationMessagesCacheKey,
            result.initialValue?.conversationId,
          ],
        })
      }

      if (parentMessageId === result.initialValue.id) {
        queryClient.invalidateQueries({
          queryKey: [getMessageCacheKey, result.initialValue.id],
        })

        listDataRevalidate()

        onClose()
      }
    })
  }

  const toggleReaction = (value: string) => {
    startTransition(async () => {
      const result = await toggleReactionAction({
        value,
        messageId: id,
      })

      if (result.status === 'error') {
        toast.error('Failed to toggle reaction')
        return
      }
      toast.success('Reaction added')

      const listDataRevalidate = () => {
        if (isConversationCache) {
          reactionRevalidate(
            'conversation',
            queryClient,
            result.initialValue?.conversationId ?? '',
          )
        } else {
          reactionRevalidate('messages', queryClient, params.channelId)
        }
      }

      listDataRevalidate()

      if (isThreadCache) {
        queryClient.invalidateQueries({
          queryKey: [getThreadsCacheKey, parentMessageId],
        })
      }

      if (parentMessageId && parentMessageId === id) {
        queryClient.invalidateQueries({
          queryKey: [getMessageCacheKey, result.initialValue?.messageId],
        })

        listDataRevalidate()
      }
    })
  }

  return {
    isEditing,
    setEditMessageId,
    isPending,
    isDeletionPending,
    onOpenMessage,
    handleUpdate,
    handleDelete,
    toggleReaction,
  } as const
}
