'use client'

import { EmojiPopover } from '@/components/ui/emoji-popover'
import { Hint } from '@/components/ui/hint'
import { toggleReactionAction } from '@/features/reactions/action/toggle-reaction-action'
import type { client } from '@/lib/rpc'
import { cn } from '@/utils/classes'
import { IconMoodPlus } from '@tabler/icons-react'
import type { InferResponseType } from 'hono'
import { useTransition } from 'react'
import { toast } from 'sonner'

type ReactionsProps = {
  reactions: InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >['messages'][number]['reactions']
  messageId: string
  currentUserId?: string
}

export const Reactions = ({
  reactions,
  messageId,
  currentUserId,
}: ReactionsProps) => {
  const [isPending, startTransition] = useTransition()

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
        <button
          type="button"
          className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1 cursor-pointer"
        >
          <IconMoodPlus stroke={2} className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  )
}
