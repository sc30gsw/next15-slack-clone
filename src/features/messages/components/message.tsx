import { Editor } from '@/components/ui/editor'
import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { deleteMessageAction } from '@/features/messages/actions/delete-message-action'
import { updateMessageAction } from '@/features/messages/actions/update-message-action'
import { MessageToolbar } from '@/features/messages/components/message-toolbar'
import { toggleReactionAction } from '@/features/reactions/action/toggle-reaction-action'
import { Confirm } from '@/hooks/use-confirm'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { useQueryClient } from '@tanstack/react-query'
import type { InferResponseType } from 'hono'
import { useParams } from 'next/navigation'
import { type JSX, type ReactNode, useState, useTransition } from 'react'
import { toast } from 'sonner'

type MessageMember = InferResponseType<
  (typeof client.api.messages)[':channelId']['$get'],
  200
>['messages'][number]['member']

type MessageProps = Pick<
  InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >['messages'][number],
  'id' | 'body' | 'image' | 'isUpdated' | 'createdAt' | 'threads'
> & {
  memberId: MessageMember['userId']
  isAuthor: boolean
  threadCount: number
  isCompact?: boolean
  hideThreadButton?: boolean
  authorAvatar: JSX.Element
  children: ReactNode
  createdAtHint: JSX.Element
}

export const Message = ({
  id,
  body,
  image,
  isUpdated,
  createdAt,
  threads,
  threadCount,
  memberId,
  isAuthor,
  isCompact,
  hideThreadButton,
  authorAvatar,
  children,
  createdAtHint,
}: MessageProps) => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

  const queryClient = useQueryClient()

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
        queryKey: [getChannelMessagesCacheKey, params.channelId],
      })

      setEditMessageId(null)
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

      queryClient.invalidateQueries({
        queryKey: [getChannelMessagesCacheKey, params.channelId],
      })

      toast.success('Message deleted')
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

      queryClient.invalidateQueries({
        queryKey: [getChannelMessagesCacheKey, params.channelId],
      })

      toast.success('Reaction added')
    })
  }

  if (isCompact) {
    return (
      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isDeletionPending &&
            'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
        )}
      >
        <div className="flex items-start gap-2">
          {createdAtHint}
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending || isDeletionPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditMessageId(null)}
                variant="update"
              />
            </div>
          ) : (
            children
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending || isDeletionPending}
            handleEdit={() => setEditMessageId(id)}
            handleDelete={handleDelete}
            handleReaction={toggleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
        isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
        isDeletionPending &&
          'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
      )}
    >
      <div className="flex items-start gap-2">
        <button type="button" className="cursor-pointer">
          {authorAvatar}
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending || isDeletionPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditMessageId(null)}
              variant="update"
            />
          </div>
        ) : (
          children
        )}
      </div>
      {!isEditing && (
        <MessageToolbar
          isAuthor={isAuthor}
          isPending={isPending || isDeletionPending}
          handleEdit={() => setEditMessageId(id)}
          handleDelete={handleDelete}
          handleReaction={toggleReaction}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  )
}
