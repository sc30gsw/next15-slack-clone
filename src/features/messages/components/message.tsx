import { Avatar } from '@/components/justd/ui'
import { Editor } from '@/components/ui/editor'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import { MessageToolbar } from '@/features/messages/components/message-toolbar'
import { ThreadBar } from '@/features/messages/components/thread-bar'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { useMessage } from '@/features/messages/hooks/use-message'
import type { MessageResponse } from '@/features/messages/types'
import { Reactions } from '@/features/reactions/components/reactions'
import { formatFullTime } from '@/lib/date'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { format } from 'date-fns'
import type { InferResponseType } from 'hono'
import Image from 'next/image'

type MessageUser = InferResponseType<
  (typeof client.api.messages.channel)[':channelId']['$get'],
  200
>['messages'][number]['user']

type MessageProps = Pick<
  MessageResponse,
  | 'id'
  | 'body'
  | 'image'
  | 'isUpdated'
  | 'createdAt'
  | 'reactions'
  | 'firstThread'
> & {
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
  const {
    isEditing,
    setEditMessageId,
    isPending,
    isDeletionPending,
    onOpenMessage,
    handleUpdate,
    handleDelete,
    toggleReaction,
  } = useMessage(id, !!isConversationCache, !!isThreadCache)

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
              <ThreadBar
                count={threadCount ?? 0}
                image={firstThread?.user.image ?? ''}
                name={firstThread?.user.name ?? ''}
                timestamp={firstThread?.createdAt}
                onClick={() => onOpenMessage(id)}
              />
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
            <ThreadBar
              count={threadCount ?? 0}
              image={firstThread?.user.image ?? ''}
              name={firstThread?.user.name ?? ''}
              timestamp={firstThread?.createdAt}
              onClick={() => onOpenMessage(id)}
            />
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
