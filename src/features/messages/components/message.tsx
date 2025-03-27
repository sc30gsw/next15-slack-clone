'use client'

import { Avatar } from '@/components/justd/ui'
import { Editor } from '@/components/ui/editor'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import { deleteMessageAction } from '@/features/messages/actions/delete-message-action'
import { updateMessageAction } from '@/features/messages/actions/update-message-action'
import { MessageToolbar } from '@/features/messages/components/message-toolbar'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { Confirm } from '@/hooks/use-confirm'
import { formatFullTime } from '@/lib/date'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { format } from 'date-fns'
import type { InferResponseType } from 'hono'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type MessageAuthor = InferResponseType<
  (typeof client.api.messages)[':channelId']['$get'],
  200
>['messages'][number]['user']

type MessageMember = InferResponseType<
  (typeof client.api.messages)[':channelId']['$get'],
  200
>['messages'][number]['member']

type MessageProps = Pick<
  InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >['messages'][number],
  'id' | 'body' | 'image' | 'isUpdated' | 'createdAt' | 'threads' | 'reactions'
> & {
  memberId: MessageMember['userId']
  authorImage: MessageAuthor['image']
  authorName: MessageAuthor['name']
  isAuthor: boolean
  threadCount: number
  isCompact?: boolean
  hideThreadButton?: boolean
}

export const Message = ({
  id,
  body,
  image,
  isUpdated,
  createdAt,
  threads,
  threadCount,
  reactions,
  memberId,
  authorImage,
  authorName = 'Member',
  isAuthor,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

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

      toast.success('Message deleted')
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
            <div className="flex flex-col w-full">
              <Renderer value={body} />
              {isUpdated === 1 && (
                <span className="text-xs text-muted-fg">(edited)</span>
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
            // handleThread={() => {}}
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
            size="small"
            shape="square"
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
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                type="button"
                className="font-bold  hover:underline cursor-pointer"
              >
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint
                label={formatFullTime(new Date(createdAt))}
                showArrow={false}
              >
                <div className="text-sm text-muted-fg hover:underline">
                  {format(new Date(createdAt), 'h:mm a')}
                </div>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {isUpdated === 1 && (
              <span className="text-xs text-muted-fg">(edited)</span>
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
          // handleThread={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  )
}
