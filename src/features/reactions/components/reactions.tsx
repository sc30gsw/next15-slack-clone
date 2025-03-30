'use client'

import { EmojiPopover } from '@/components/ui/emoji-popover'
import { Hint } from '@/components/ui/hint'
import {
  getChannelMessagesCacheKey,
  getMessageCacheKey,
  getThreadsCacheKey,
} from '@/constants/cache-keys'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { useThreadMessage } from '@/features/messages/hooks/use-thread-message'
import type { useThreads } from '@/features/messages/hooks/use-threads'
import { toggleReactionAction } from '@/features/reactions/action/toggle-reaction-action'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { IconMoodPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import type { InferResponseType } from 'hono'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type ReactionsProps = {
  reactions: InferResponseType<
    (typeof client.api.messages.channel)[':channelId']['$get'],
    200
  >['messages'][number]['reactions']
  messageId: string
  currentUserId?: string
  threadsRefetch?: ReturnType<typeof useThreads>['refetch']
}

export const Reactions = ({
  reactions,
  messageId,
  currentUserId,
  threadsRefetch,
}: ReactionsProps) => {
  const [isPending, startTransition] = useTransition()

  const params = useParams<Record<'workspaceId' | 'channelId', string>>()
  const queryClient = useQueryClient()

  const { parentMessageId } = usePanel()
  const { refetch } = useThreadMessage(
    parentMessageId,
    currentUserId ?? undefined,
  )

  if (reactions.length === 0 || !currentUserId) {
    return null
  }

  const toggleReaction = (value: string) => {
    startTransition(async () => {
      const result = await toggleReactionAction({
        value,
        messageId,
      })

      if (result.status === 'error') {
        toast.error('Failed to toggle reaction')
        return
      }

      queryClient.invalidateQueries({
        queryKey: [getChannelMessagesCacheKey, params.channelId],
      })

      if (threadsRefetch) {
        queryClient.invalidateQueries({
          queryKey: [getThreadsCacheKey, parentMessageId],
        })

        await threadsRefetch()
      }

      if (parentMessageId && parentMessageId === messageId) {
        queryClient.invalidateQueries({
          queryKey: [getMessageCacheKey, result.initialValue?.messageId],
        })

        await refetch()
      }
    })
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {reactions.map((reaction) => (
        <Hint
          key={reaction.id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
          onPress={() => toggleReaction(reaction.value)}
          disabled={isPending}
        >
          <div
            className={cn(
              'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1 cursor-pointer',
              reaction.memberIds.includes(currentUserId) &&
                'bg-blue-100/70 border-blue-500 text-white',
              isPending && 'opacity-50 cursor-not-allowed',
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-xs font-semibold text-muted-fg',
                reaction.memberIds.includes(currentUserId) && 'text-blue-500',
              )}
            >
              {reaction.count}
            </span>
          </div>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => toggleReaction(emoji.native)}
        disabled={isPending}
      >
        <div className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1 cursor-pointer">
          <IconMoodPlus stroke={2} className="size-4" />
        </div>
      </EmojiPopover>
    </div>
  )
}
