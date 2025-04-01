import { Avatar } from '@/components/justd/ui'
import { Editor } from '@/components/ui/editor'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import {
  getConversationMessagesCacheKey,
  getMessageCacheKey,
  getThreadsCacheKey,
} from '@/constants/cache-keys'
import { deleteMessageAction } from '@/features/messages/actions/delete-message-action'
import { updateMessageAction } from '@/features/messages/actions/update-message-action'
import { MessageToolbar } from '@/features/messages/components/message-toolbar'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { toggleReactionAction } from '@/features/reactions/action/toggle-reaction-action'
import { Reactions } from '@/features/reactions/components/reactions'
import { reactionRevalidate } from '@/features/reactions/utils/reaction-revalidate'
import { Confirm } from '@/hooks/use-confirm'
import { formatFullTime } from '@/lib/date'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { useQueryClient } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import type { InferResponseType } from 'hono'
import { IconChevronRight } from 'justd-icons'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type MessageMember = InferResponseType<
  (typeof client.api.messages.channel)[':channelId']['$get'],
  200
>['messages'][number]['member']

type MessageUser = InferResponseType<
  (typeof client.api.messages.channel)[':channelId']['$get'],
  200
>['messages'][number]['user']

type MessageProps = Pick<
  InferResponseType<
    (typeof client.api.messages.channel)[':channelId']['$get'],
    200
  >['messages'][number],
  | 'id'
  | 'body'
  | 'image'
  | 'isUpdated'
  | 'createdAt'
  | 'reactions'
  | 'firstThread'
> & {
  memberId: MessageMember['userId']
  isAuthor: boolean
  threadCount?: number
  isCompact?: boolean
  hideThreadButton?: boolean
  authorImage: MessageUser['image']
  authorName: MessageUser['name']
  userId?: string
  isThreadCache?: boolean
  isConversationCache?: boolean
}

export const Message = ({
  id,
  body,
  image,
  isUpdated,
  createdAt,
  threadCount,
  firstThread,
  reactions,
  memberId,
  isAuthor,
  isCompact,
  hideThreadButton,
  authorImage,
  authorName,
  userId,
  isThreadCache,
  isConversationCache,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Since this is a common component, having many props is unavoidable.
}: MessageProps) => {
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
          <Hint label={formatFullTime(new Date(createdAt))} showArrow={false}>
            <div className="text-xs text-muted-fg opacity-0 group-hover:opacity-100 w-10 leading-5.5 text-center hover:underline">
              {format(new Date(createdAt), 'hh:mm')}
            </div>
          </Hint>
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
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-bold text-black hover:underline cursor-pointer"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint
                  label={formatFullTime(new Date(createdAt))}
                  showArrow={false}
                >
                  <p className="text-sm text-muted-fg hover:underline cursor-pointer">
                    {format(new Date(createdAt), 'h:mm a')}
                  </p>
                </Hint>
              </div>
              <Renderer value={body} />
              {image && (
                <Thumbnail
                  modalContentImage={
                    <Image
                      src={image}
                      alt="Message image"
                      height={100}
                      width={100}
                      className="rounded-md object-cover size-full"
                    />
                  }
                >
                  <Image
                    src={image}
                    alt="Message image"
                    height={100}
                    width={100}
                    className="rounded-md object-cover size-full"
                  />
                </Thumbnail>
              )}
              {isUpdated === 1 && (
                <span className="text-xs text-muted-fg">(edited)</span>
              )}
              <Reactions
                reactions={reactions}
                messageId={id}
                currentUserId={userId}
                isThreadCache={isThreadCache}
                isConversationCache={isConversationCache}
              />
              {firstThread && (
                <button
                  type="button"
                  className="p-1 flex items-center justify-between text-sm group cursor-pointer hover:border rounded-md transition-colors duration-200 w-55"
                  onClick={() => onOpenMessage(id)}
                >
                  <div className="flex items-center gap-x-2">
                    <Avatar
                      size="small"
                      shape="square"
                      src={firstThread.user.image}
                      alt={firstThread.user.name ?? 'Member'}
                      initials={authorName?.charAt(0).toUpperCase()}
                      className="bg-sky-500 text-white"
                    />
                    <span className="font-bold text-primary group-hover:underline transition-colors duration-200">
                      {threadCount} reply
                    </span>

                    <div className="text-gray-500">
                      <span className="block group-hover:hidden">
                        {formatDistanceToNow(new Date(firstThread.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="hidden group-hover:flex items-center">
                        View threads
                      </span>
                    </div>
                  </div>
                  <IconChevronRight className="size-5 hidden group-hover:block" />
                </button>
              )}
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending || isDeletionPending}
            handleEdit={() => setEditMessageId(id)}
            handleDelete={handleDelete}
            handleThread={() => onOpenMessage(id)}
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
          <Avatar
            alt={authorName ?? 'Member'}
            shape="square"
            size="large"
            src={authorImage}
            initials={authorName?.charAt(0).toUpperCase()}
            className="bg-sky-500 text-white"
          />
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
          <div className="flex flex-col w-full">
            <div className="text-sm">
              <button
                type="button"
                className="font-bold text-black hover:underline cursor-pointer"
              >
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint
                label={formatFullTime(new Date(createdAt))}
                showArrow={false}
              >
                <p className="text-sm text-muted-fg hover:underline cursor-pointer">
                  {format(new Date(createdAt), 'h:mm a')}
                </p>
              </Hint>
            </div>
            <Renderer value={body} />
            {image && (
              <Thumbnail
                modalContentImage={
                  <Image
                    src={image}
                    alt="Message image"
                    height={100}
                    width={100}
                    className="rounded-md object-cover size-full"
                  />
                }
              >
                <Image
                  src={image}
                  alt="Message image"
                  height={100}
                  width={100}
                  className="rounded-md object-cover size-full"
                />
              </Thumbnail>
            )}
            {isUpdated === 1 && (
              <span className="text-xs text-muted-fg">(edited)</span>
            )}
            <Reactions
              reactions={reactions}
              messageId={id}
              currentUserId={userId}
              isThreadCache={isThreadCache}
              isConversationCache={isConversationCache}
            />

            {firstThread && (
              <button
                type="button"
                className="p-1 flex items-center justify-between text-sm group cursor-pointer hover:border rounded-md transition-colors duration-200 w-55"
                onClick={() => onOpenMessage(id)}
              >
                <div className="flex items-center gap-x-2">
                  <Avatar
                    size="small"
                    shape="square"
                    src={firstThread.user.image}
                    alt={firstThread.user.name ?? 'Member'}
                    initials={authorName?.charAt(0).toUpperCase()}
                    className="bg-sky-500 text-white"
                  />
                  <span className="font-bold text-primary group-hover:underline transition-colors duration-200">
                    {threadCount} reply
                  </span>

                  <div className="text-gray-500">
                    <span className="block group-hover:hidden">
                      {formatDistanceToNow(new Date(firstThread.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="hidden group-hover:flex items-center">
                      View threads
                    </span>
                  </div>
                </div>
                <IconChevronRight className="size-5 hidden group-hover:block" />
              </button>
            )}
          </div>
        )}
      </div>
      {!isEditing && (
        <MessageToolbar
          isAuthor={isAuthor}
          isPending={isPending || isDeletionPending}
          handleEdit={() => setEditMessageId(id)}
          handleDelete={handleDelete}
          handleThread={() => onOpenMessage(id)}
          handleReaction={toggleReaction}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  )
}
